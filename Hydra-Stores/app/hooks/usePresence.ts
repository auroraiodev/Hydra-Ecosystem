'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

function getWsUrl(): string {
  const envChatUrl = process.env.NEXT_PUBLIC_CHAT_URL;
  if (envChatUrl) return envChatUrl;

  if (typeof window === 'undefined') return 'http://localhost:3007';
  const { hostname, protocol } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') return `http://${hostname}:3007`;
  const wsProtocol = protocol === 'https:' ? 'https:' : 'http:';
  if (hostname.endsWith('hydracollect.com')) return `${wsProtocol}//chat.hydracollect.com`;
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl?.startsWith('http')) return envUrl.replace(/\/api$/, '');
  return window.location.origin;
}

export function usePresence() {
  const socketRef = useRef<any>(null);
  const pathname = usePathname();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  useEffect(() => {
    if (!isAuthenticated) return;

    let socket: any;

    import('socket.io-client').then(({ io }) => {
      socket = io(`${getWsUrl()}/presence`, {
        query: { page: pathname },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 3000,
        reconnectionAttempts: 5,
      });
      socketRef.current = socket;

      socket.on('ip_blocked', () => {
        socket.disconnect();
        window.location.replace('/maintenance');
      });
    });

    return () => {
      socket?.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Emit page_change whenever route changes after connected
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    const t = setTimeout(() => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('page_change', { page: pathname });
      }
    }, 200);
    return () => clearTimeout(t);
  }, [pathname]);
}

