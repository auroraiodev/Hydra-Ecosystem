'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useChatAdmin } from '@/hooks/useChatAdmin';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { toast } from 'sonner';
import { ChatSidebar, ChatThread, ChatInput } from './components';
import { usersAPI } from '@/lib/api';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export default function AdminChatPage() {
  const {
    conversations,
    activeUserId,
    activeMessages,
    setActiveUserId,
    sendMessage,
    deleteMessage,
    deleteConversation,
    isConnected,
    isLoading,
  } = useChatAdmin();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [temporaryConversations, setTemporaryConversations] = useState<any[]>([]);

  useEffect(() => {
    setIsLoadingUsers(true);
    usersAPI
      .list()
      .then((res: any) => {
        const raw = res?.data?.data || res?.data || res || [];
        setUsers(Array.isArray(raw) ? raw : []);
      })
      .catch((err) => {
        console.error('Error fetching users for chat:', err);
      })
      .finally(() => {
        setIsLoadingUsers(false);
      });
  }, []);

  const handleSelectUser = useCallback((user: User) => {
    const existing = conversations.find((c) => c.userId === user.id);
    if (existing) {
      setActiveUserId(user.id);
    } else {
      const tempConvo = {
        userId: user.id,
        userEmail: user.email,
        userName: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || user.email,
        lastMessage: '',
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0,
        isOnline: false,
      };

      setTemporaryConversations((prev) => {
        if (prev.some((c) => c.userId === user.id)) return prev;
        return [tempConvo, ...prev];
      });
      setActiveUserId(user.id);
    }
  }, [conversations, setActiveUserId]);

  const mergedConversations = useMemo(() => {
    const all = [...conversations];
    for (const temp of temporaryConversations) {
      if (!all.some((c) => c.userId === temp.userId)) {
        all.push(temp);
      }
    }
    return all;
  }, [conversations, temporaryConversations]);

  const totalUnread = useMemo(
    () => mergedConversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0),
    [mergedConversations]
  );

  // Keep sidebar unread badge perfectly synced with actual conversation state
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('chat:unread-update', { detail: totalUnread }));
  }, [totalUnread]);

  // Mobile: 'list' shows conversations, 'chat' shows active thread
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  // Handle incoming ?user= ID from push notifications or toasts
  const handleUrlUserId = useCallback(() => {
    const search = new URLSearchParams(window.location.search);
    const user = search.get('user');
    if (user) {
      setActiveUserId(user);
      setMobileView('chat');
      window.history.replaceState({}, '', '/dashboard/chat');
    }
  }, [setActiveUserId]);

  useEffect(() => {
    handleUrlUserId();
  }, [handleUrlUserId]);

  const { supported: pushSupported, subscribed, subscribe, unsubscribe } = usePushNotifications();

  const handleBack = () => {
    setMobileView('list');
    setActiveUserId(null);
  };

  const handlePushToggle = async () => {
    if (subscribed) {
      await unsubscribe();
      toast.success('Notificaciones desactivadas');
    } else {
      const ok = await subscribe();
      if (ok) toast.success('Notificaciones activadas');
      else toast.error('No se pudo activar las notificaciones');
    }
  };

  const activeConvo = mergedConversations.find((c) => c.userId === activeUserId);

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] md:h-screen overflow-hidden bg-background">
      <ChatSidebar
        conversations={mergedConversations}
        activeUserId={activeUserId}
        setActiveUserId={setActiveUserId}
        setMobileView={setMobileView}
        totalUnread={totalUnread}
        pushSupported={pushSupported}
        subscribed={subscribed}
        onPushToggle={handlePushToggle}
        isConnected={isConnected}
        mobileView={mobileView}
        users={users}
        onSelectUser={handleSelectUser}
      />

      <ChatThread
        activeUserId={activeUserId}
        activeMessages={activeMessages}
        activeConvo={activeConvo}
        isLoading={isLoading}
        onBack={handleBack}
        onDeleteConversation={deleteConversation}
        onDeleteMessage={deleteMessage}
        mobileView={mobileView}
      >
        <ChatInput
          onSendMessage={(content) => activeUserId && sendMessage(activeUserId, content)}
          isConnected={isConnected}
          activeUserId={activeUserId}
        />
      </ChatThread>
    </div>
  );
}
