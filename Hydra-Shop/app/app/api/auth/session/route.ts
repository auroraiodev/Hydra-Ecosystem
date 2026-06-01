import { Buffer } from 'buffer';
import { NextRequest, NextResponse } from 'next/server';
import { API_URL, AUTH_COOKIE_MAX_AGE, REFRESH_COOKIE_MAX_AGE } from '@/lib/constants/api';

async function attemptRefresh(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh-token')?.value;
  if (!refreshToken) {
    return null;
  }

  try {
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
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

export async function GET(request: NextRequest) {
  const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
  const isProduction = process.env.NODE_ENV === 'production';
  const authToken = request.cookies.get('__sid')?.value;

  let payload: any = null;

  if (authToken) {
    try {
      const parts = authToken.split('.');
      if (parts.length === 3) {
        payload = JSON.parse(
          Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
        );
      }
    } catch {
      payload = null;
    }
  }

  const isExpired = payload?.exp && (Date.now() >= payload.exp * 1000);

  if (!payload || isExpired) {
    const refreshData = await attemptRefresh(request);
    if (refreshData) {
      const { accessToken, refreshToken } = refreshData;

      const response = NextResponse.json({ authenticated: true, token: accessToken });

      response.cookies.set('__sid', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/',
        maxAge: AUTH_COOKIE_MAX_AGE,
        domain: cookieDomain,
      });

      response.cookies.set('refresh-token', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        path: '/',
        maxAge: REFRESH_COOKIE_MAX_AGE,
        domain: cookieDomain,
      });

      return response;
    }

    const response = NextResponse.json({ authenticated: false }, { status: 200 });
    response.cookies.set('__sid', '', { path: '/', maxAge: 0 });
    response.cookies.set('refresh-token', '', { path: '/', maxAge: 0 });
    if (cookieDomain) {
      response.cookies.set('__sid', '', { path: '/', maxAge: 0, domain: cookieDomain });
      response.cookies.set('refresh-token', '', { path: '/', maxAge: 0, domain: cookieDomain });
    }
    return response;
  }

  return NextResponse.json({ authenticated: true, token: authToken });
}

