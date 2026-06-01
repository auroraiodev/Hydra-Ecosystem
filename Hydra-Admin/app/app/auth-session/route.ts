import { type NextRequest, NextResponse } from 'next/server';
import { decryptCookie, COOKIE_NAME } from '@/lib/cookie-crypto';

export async function GET(request: NextRequest) {
  const raw = request.cookies.get(COOKIE_NAME)?.value;
  if (!raw) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  // AES-256-GCM decryption — if this succeeds, the cookie is untampered
  const token = decryptCookie(raw);
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  // Decode JWT payload (no signature verification needed — AES-GCM already guarantees integrity)
  const parts = token.split('.');
  if (parts.length !== 3) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  // Check token expiry
  const exp = typeof payload.exp === 'number' ? payload.exp : 0;
  if (exp > 0 && Math.floor(Date.now() / 1000) >= exp) {
    const res = NextResponse.json({ authenticated: false, reason: 'expired' }, { status: 200 });
    res.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
    return res;
  }

  // Extract role — JWT stores it as a plain string (set by NestJS JwtService)
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
