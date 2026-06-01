import { type NextRequest, NextResponse } from 'next/server';
import { BACKEND_BASE_URL } from '@/lib/api-config';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const backendResponse = await fetch(`${BACKEND_BASE_URL}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({ message: 'Login failed' }));
      return NextResponse.json(
        { message: errorData.message || errorData.error || 'Invalid credentials' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    const backendData = data?.data || data;

    // Backend has already set httpOnly __sid=<raw JWT> cookie via its own Set-Cookie header.
// We do NOT re-set the cookie here — doing so causes a double Set-Cookie fight where
// the browser stores our encrypted value but the backend's JwtStrategy reads the raw JWT,
// causing every request after login to fail with 401.
//
// The backend's cookie is the authoritative session token. No further cookie action needed.
return NextResponse.json({
  user: backendData.user,
  refreshToken: backendData.refreshToken,
});
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
