import { NextRequest, NextResponse } from 'next/server';
import { encryptCookie, COOKIE_NAME } from '@/lib/cookie-crypto';

const AUTH_SERVICE_URL = (process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:3002/api/v1').replace('localhost', '127.0.0.1');

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const baseUrl = request.nextUrl.origin;

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, baseUrl)
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', baseUrl));
  }

  try {
    // Forward the OAuth callback to hydra-auth
    const callbackUrl = new URL(`${AUTH_SERVICE_URL}/auth/google/callback`);
    callbackUrl.searchParams.set('code', code);

    const authResponse = await fetch(callbackUrl.toString(), {
      method: 'GET',
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
      redirect: 'manual',
    });

    if (authResponse.status >= 300 && authResponse.status < 400) {
      const redirectLocation = authResponse.headers.get('location');
      if (redirectLocation) {
        const finalRedirectUrl = new URL(redirectLocation, baseUrl);
        // Force the redirect to stay on the admin panel by rewriting the host
        if (finalRedirectUrl.host !== request.nextUrl.host) {
          finalRedirectUrl.protocol = request.nextUrl.protocol;
          finalRedirectUrl.host = request.nextUrl.host;
        }
        const response = NextResponse.redirect(finalRedirectUrl);
        copyAuthCookies(authResponse, response);
        return response;
      }
    }

    if (!authResponse.ok) {
      const errorText = await authResponse.text().catch(() => 'Unknown error');
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(errorText)}`, baseUrl)
      );
    }

    const authData = await authResponse.json();

    // Check if user has admin/seller role
    const userRole = authData.user?.role?.name || authData.user?.role;
    const allowedRoles = ['ADMIN', 'SELLER', 'OWNER'];

    if (!userRole || !allowedRoles.includes(userRole.toUpperCase())) {
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent('Access denied. Admin dashboard is only for administrators.')}`,
          baseUrl
        )
      );
    }

    const redirectParams = new URLSearchParams();
    redirectParams.set('oauth_success', 'true');

    if (authData.user) {
      const encodedAuth = Buffer.from(
        JSON.stringify({ id: authData.user.id, email: authData.user.email })
      ).toString('base64');
      redirectParams.set('auth', encodedAuth);
    }

    const redirectUrl = new URL(`/dashboard?${redirectParams.toString()}`, baseUrl);
    const response = NextResponse.redirect(redirectUrl);

    // DO NOT touch __sid cookie here — backend already set it as httpOnly raw JWT.
    // We only set refresh-token and __role (no sensitive data).
    setUserCookies(response, authData);

    return response;
  } catch (error) {
    console.error('[Admin OAuth Callback] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'OAuth failed';
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorMessage)}`, baseUrl)
    );
  }
}

function copyAuthCookies(authResponse: Response, response: NextResponse) {
  // headers.getSetCookie() returns ALL Set-Cookie headers as an array
  // (unlike .get() which only returns the last one). This preserves both
  // __sid and refresh-token from the backend.
  const setCookies = authResponse.headers.getSetCookie();
  for (const cookie of setCookies) {
    response.headers.append('set-cookie', cookie);
  }
}

function setUserCookies(response: NextResponse, authData: {
  accessToken?: string;
  refreshToken?: string;
  user?: { role?: { name?: string } | string };
}) {
  // DO NOT encrypt and re-set __sid — the backend already set it as httpOnly raw JWT.
  // Re-setting it as encrypted would override the valid raw JWT and cause 401s.
  if (authData.refreshToken) {
    response.cookies.set('refresh-token', authData.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
  }

  // Plain role cookie — no sensitive data, readable by Edge middleware for redirects.
  const userRole = authData.user?.role;
  const roleName = typeof userRole === 'string' ? userRole : userRole?.name;
  if (roleName) {
    response.cookies.set('__role', roleName.toUpperCase(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });
  }
}
