"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import apiClient from "@/lib/apiClient";

export interface ChatSummary {
  id: string;
  identity: string;
  key: string;
  name: string;
  updated: string;
}

export interface ChatMessage {
  id: string;
  body: string;
  created: string;
  identity: string;
}

export const useChat = () => {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = useCallback(async () => {
    try {
      setLoadingChats(true);
      setError(null);
      const { data } = await apiClient.get<ChatSummary[]>("/chat");
      setChats(data ?? []);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to load chats");
    } finally {
      setLoadingChats(false);
    }
  }, []);

  const fetchMessages = useCallback(async (chatId: string, page = 1, limit = 20) => {
    try {
      setLoadingMessages(true);
      setError(null);
      const { data } = await apiClient.get<{ data: ChatMessage[] }>(
        `/chat/${chatId}/messages`,
        {
          params: { chat: chatId, page, limit }
        }
      );
      setMessages((prev) => ({
        ...prev,
        [chatId]: data?.data ?? []
      }));
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (chatId: string, body: string) => {
      if (!body.trim()) return;
      try {
        setError(null);
        await apiClient.post(`/chat/${chatId}/send`, null, {
          params: { chat: chatId, body }
        });
        await fetchMessages(chatId);
      } catch (err: any) {
        setError(err?.response?.data?.message ?? "Failed to send message");
      }
    },
    [fetchMessages]
  );

  const createChat = useCallback(
    async (name: string, friendIds: string[]) => {
      try {
        setError(null);
        const formData = new FormData();
        formData.append("name", name);
        friendIds.forEach((id) => formData.append("friends", id));
        await apiClient.post("/chat/create", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        await fetchChats();
      } catch (err: any) {
        setError(err?.response?.data?.message ?? "Unable to create chat");
      }
    },
    [fetchChats]
  );

  const renameChat = useCallback(
    async (chatId: string, name: string) => {
      try {
        setError(null);
        await apiClient.put(`/chat/${chatId}`, { name });
        await fetchChats();
      } catch (err: any) {
        setError(err?.response?.data?.message ?? "Unable to rename chat");
      }
    },
    [fetchChats]
  );

  const deleteChat = useCallback(async (chatId: string) => {
    try {
      setError(null);
      await apiClient.delete(`/chat/${chatId}`);
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Unable to delete chat");
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return useMemo(
    () => ({
      chats,
      messages,
      loadingChats,
      loadingMessages,
      error,
      fetchChats,
      fetchMessages,
      sendMessage,
      createChat,
      renameChat,
      deleteChat
    }),
    [
      chats,
      messages,
      loadingChats,
      loadingMessages,
      error,
      fetchChats,
      fetchMessages,
      sendMessage,
      createChat,
      renameChat,
      deleteChat
    ]
  );
};
