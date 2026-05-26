/**
 * Lightweight reverse proxy — single public entry point for the FE container.
 *
 * Port layout:
 *   PORT (3000) — this proxy, exposed to Traefik / the internet
 *   NEXT_PORT   (3009) — Next.js standalone (internal only)
 *   NEST_PORT   (3002) — NestJS + socket.io (internal only)
 *
 * Routing:
 *   WebSocket upgrades              → NestJS (socket.io lives there)
 *   GET /socket.io/* (HTTP polling) → NestJS
 *   Everything else                 → Next.js
 */

import http from 'http';
import net from 'net';

const PORT      = parseInt(process.env.PORT         || '3000', 10);
const NEXT_PORT = parseInt(process.env.NEXT_PORT     || '3009', 10);
const NEST_PORT = parseInt(process.env.BACKEND_PORT  || '3002', 10);

function proxyHttp(req, res, targetPort) {
  const upstream = http.request(
    { hostname: '127.0.0.1', port: targetPort, path: req.url, method: req.method, headers: req.headers },
    (upRes) => {
      res.writeHead(upRes.statusCode, upRes.headers);
      upRes.pipe(res, { end: true });
    },
  );
  upstream.on('error', () => {
    if (!res.headersSent) res.writeHead(502);
    res.end('Bad Gateway');
  });
  req.pipe(upstream, { end: true });
}

function proxyWs(req, socket, head, targetPort) {
  const target = net.connect(targetPort, '127.0.0.1', () => {
    const rawHeaders = Object.entries(req.headers).map(([k, v]) => `${k}: ${v}`).join('\r\n');
    target.write(`${req.method} ${req.url} HTTP/${req.httpVersion}\r\n${rawHeaders}\r\n\r\n`);
    if (head?.length) target.write(head);
    socket.pipe(target);
    target.pipe(socket);
  });
  target.on('error', () => socket.destroy());
  socket.on('error', () => target.destroy());
}

const server = http.createServer((req, res) => {
  proxyHttp(req, res, req.url?.startsWith('/socket.io') ? NEST_PORT : NEXT_PORT);
});

server.on('upgrade', (req, socket, head) => {
  proxyWs(req, socket, head, NEST_PORT);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[ws-proxy] :${PORT} → Next.js :${NEXT_PORT}, NestJS/WS :${NEST_PORT}`);
});
