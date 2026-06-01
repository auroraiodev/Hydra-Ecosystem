import { type NextRequest, NextResponse } from 'next/server';
import { decryptCookie, encryptCookie, COOKIE_NAME } from '@/lib/cookie-crypto';
import { COOKIE_MAX_AGE, REFRESH_COOKIE_MAX_AGE } from '@/lib/parse-expiry';

function getApiBaseUrl() {
  const base =
    process.env.API_URL_INTERNAL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://127.0.0.1:3002/api';
  const normalized = base.trim().replace('localhost', '127.0.0.1').replace(/\/+$/, '');
  const withApi = normalized.endsWith('/api') ? normalized : `${normalized}/api`;
  return `${withApi}/v1`;
}

async function attemptRefresh(request: NextRequest, apiBaseUrl: string) {
  const refreshToken = request.cookies.get('refresh-token')?.value;
  if (!refreshToken) {
    return null;
  }

  try {
    const refreshRes = await fetch(`${apiBaseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshRes.ok) {
      return null;
    }

    const data = await refreshRes.json().catch(() => ({}));
    if (!data.accessToken || !data.refreshToken) {
      return null;
    }

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch (err) {
    console.error('[Session Route] Server-side refresh error:', err);
    return null;
  }
}

async function fetchUserProfile(accessToken: string, apiBaseUrl: string) {
  const backendUrl = `${apiBaseUrl}/users/profile`;
  const profileRes = await fetch(backendUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!profileRes.ok) {
    return null;
  }

  const result = await profileRes.json().catch(() => null);
  if (!result) return null;
  return result?.data !== undefined ? result.data : result;
}

function isRoleAuthorized(dbUser: any): boolean {
  const role = dbUser?.role?.name?.toUpperCase() || dbUser?.role?.toUpperCase();
  return role === 'SELLER' || role === 'ADMIN';
}

export async function GET(request: NextRequest) {
  const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
  const apiBaseUrl = getApiBaseUrl();

  try {
    const raw = request.cookies.get(COOKIE_NAME)?.value;
    let token = raw ? decryptCookie(raw) : null;
    let payload: any = null;

    if (token) {
      const parts = token.split('.');
      if (parts.length === 3) {
        try {
          payload = JSON.parse(
            Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
          );
        } catch {
          payload = null;
        }
      }
    }

    const isExpired = payload?.exp && (Date.now() >= payload.exp * 1000);
    let dbUser: any = null;

    if (token && payload && !isExpired) {
      dbUser = await fetchUserProfile(token, apiBaseUrl);
    }

    if (!dbUser) {
      const refreshData = await attemptRefresh(request, apiBaseUrl);
      if (refreshData) {
        const { accessToken, refreshToken } = refreshData;
        dbUser = await fetchUserProfile(accessToken, apiBaseUrl);

        if (dbUser && isRoleAuthorized(dbUser)) {
          const role = dbUser?.role?.name?.toUpperCase() || dbUser?.role?.toUpperCase();
          const user = {
            id: dbUser.id,
            email: dbUser.email,
            role,
            first_name: dbUser.first_name,
            last_name: dbUser.last_name,
            avatar_url: dbUser.avatar_url,
          };

          const response = NextResponse.json({
            authenticated: true,
            user,
          });

          response.cookies.set(COOKIE_NAME, encryptCookie(accessToken), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: COOKIE_MAX_AGE,
            domain: cookieDomain,
          });

          response.cookies.set('refresh-token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: REFRESH_COOKIE_MAX_AGE,
            domain: cookieDomain,
          });

          return response;
        }
      }

      const response = NextResponse.json(
        { authenticated: false, error: 'Session expired or invalid' },
        { status: 200 }
      );
      response.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
      response.cookies.set('refresh-token', '', { path: '/', maxAge: 0 });
      if (cookieDomain) {
        response.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0, domain: cookieDomain });
        response.cookies.set('refresh-token', '', { path: '/', maxAge: 0, domain: cookieDomain });
      }
      return response;
    }

    if (!isRoleAuthorized(dbUser)) {
      console.warn('[Session API] Unauthorized database role:', dbUser?.role);
      const response = NextResponse.json(
        { authenticated: false, error: 'Unauthorized role' },
        { status: 200 }
      );
      response.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
      response.cookies.set('refresh-token', '', { path: '/', maxAge: 0 });
      if (cookieDomain) {
        response.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0, domain: cookieDomain });
        response.cookies.set('refresh-token', '', { path: '/', maxAge: 0, domain: cookieDomain });
      }
      return response;
    }

    const role = dbUser?.role?.name?.toUpperCase() || dbUser?.role?.toUpperCase();
    const user = {
      id: dbUser.id,
      email: dbUser.email,
      role,
      first_name: dbUser.first_name,
      last_name: dbUser.last_name,
      avatar_url: dbUser.avatar_url,
    };

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error('[Session API Error]:', error);
    const response = NextResponse.json({ authenticated: false }, { status: 200 });
    response.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
    response.cookies.set('refresh-token', '', { path: '/', maxAge: 0 });
    if (cookieDomain) {
      response.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0, domain: cookieDomain });
      response.cookies.set('refresh-token', '', { path: '/', maxAge: 0, domain: cookieDomain });
    }
    return response;
  }
}

