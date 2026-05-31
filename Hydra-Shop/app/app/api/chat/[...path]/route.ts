/**
 * Proxy for hydra-chat REST API.
 * Routes /api/chat/* → CHAT_SERVICE_URL/api/v1/chat/*
 * Takes precedence over the universal /api/[...path] catch-all.
 */
import { type NextRequest, NextResponse } from 'next/server';

const CHAT_URL = (
  process.env.CHAT_SERVICE_URL ||
  'https://chat.hydracollect.com'
).replace(/\/+$/, '');

async function proxyRequest(request: NextRequest, params: { path: string[] }): Promise<NextResponse> {
  const path = params.path.join('/');
  const targetUrl = `${CHAT_URL}/api/v1/chat/${path}${request.nextUrl.search}`;

  const headers: Record<string, string> = {};
  const contentType = request.headers.get('content-type');
  if (contentType) headers['Content-Type'] = contentType;
  
  const authHeader = request.headers.get('authorization');
  if (authHeader) headers['Authorization'] = authHeader;

  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) headers['X-Forwarded-For'] = forwarded;

  const body =
    request.method !== 'GET' && request.method !== 'HEAD'
      ? await request.arrayBuffer()
      : undefined;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);

    const responseBody = await response.arrayBuffer();
    const resHeaders = new Headers();
    const blocked = ['set-cookie', 'content-encoding', 'content-length', 'connection', 'keep-alive', 'transfer-encoding'];
    response.headers.forEach((value, key) => {
      if (!blocked.includes(key.toLowerCase())) resHeaders.set(key, value);
    });

    return new NextResponse(responseBody, { status: response.status, headers: resHeaders });
  } catch (error: any) {
    clearTimeout(timeout);
    return NextResponse.json({ success: false, error: 'Chat service unreachable', message: error?.message }, { status: 502 });
  }
}

type RouteContext = { params: Promise<{ path: string[] }> };

const handler = async (request: NextRequest, context: RouteContext) => {
  const params = await context.params;
  return proxyRequest(request, params);
};

export const GET    = handler;
export const POST   = handler;
export const PUT    = handler;
export const PATCH  = handler;
export const DELETE = handler;
export const OPTIONS = handler;
