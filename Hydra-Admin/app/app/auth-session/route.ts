import { type NextRequest, NextResponse } from 'next/server';
import { decryptCookie, encryptCookie, COOKIE_NAME } from '@/lib/cookie-crypto';
import { COOKIE_MAX_AGE, REFRESH_COOKIE_MAX_AGE } from '@/lib/parse-expiry';
import { BACKEND_BASE_URL } from '@/lib/api-config';

async function attemptRefresh(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh-token')?.value;
  if (!refreshToken) {
    return null;
  }

  try {
    const refreshRes = await fetch(`${BACKEND_BASE_URL}/auth/refresh`, {
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

    const parts = data.accessToken.split('.');
    if (parts.length !== 3) {
      return null;
    }

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    } catch {
      return null;
    }

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      payload,
    };
  } catch (err) {
    console.error('[Session Route] Server-side refresh error:', err);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const raw = request.cookies.get(COOKIE_NAME)?.value;
  let token = raw ? decryptCookie(raw) : null;
  let payload: Record<string, unknown> | null = null;

  if (token) {
    const parts = token.split('.');
    if (parts.length === 3) {
      try {
        payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
      } catch {
        payload = null;
      }
    }
  }

  const exp = typeof payload?.exp === 'number' ? payload.exp : 0;
  const isExpired = exp > 0 && Math.floor(Date.now() / 1000) >= exp;

  if (!payload || isExpired) {
    const refreshData = await attemptRefresh(request);
    if (refreshData) {
      const { accessToken, refreshToken, payload: newPayload } = refreshData;
      const role = (typeof newPayload.role === 'string' ? newPayload.role : '').toUpperCase();

      const res = NextResponse.json({
        authenticated: true,
        user: {
          id: newPayload.sub ?? newPayload.id,
          email: newPayload.email,
          role,
          first_name: newPayload.first_name ?? null,
          last_name: newPayload.last_name ?? null,
          avatar_url: newPayload.avatar_url ?? null,
        },
      });

      res.cookies.set(COOKIE_NAME, encryptCookie(accessToken), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: COOKIE_MAX_AGE,
      });

      res.cookies.set('refresh-token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: REFRESH_COOKIE_MAX_AGE,
      });

      return res;
    }

    const res = NextResponse.json({ authenticated: false, reason: isExpired ? 'expired' : 'unauthenticated' }, { status: 200 });
    res.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
    res.cookies.set('refresh-token', '', { path: '/', maxAge: 0 });
    return res;
  }

  const role = (typeof payload.role === 'string' ? payload.role : '').toUpperCase();

  return NextResponse.json({
    authenticated: true,
    user: {
      id: payload.sub ?? payload.id,
      email: payload.email,
      role,
      first_name: payload.first_name ?? null,
      last_name: payload.last_name ?? null,
      avatar_url: payload.avatar_url ?? null,
    },
  });
}

