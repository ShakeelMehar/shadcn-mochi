"use client";

import { useEffect, useMemo, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, PlusCircle, Send } from "lucide-react";

export default function ChatsPage() {
  const {
    chats,
    messages,
    fetchMessages,
    sendMessage,
    loadingChats,
    loadingMessages,
    createChat,
    error
  } = useChat();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messageBody, setMessageBody] = useState("");
  const [creatingChat, setCreatingChat] = useState(false);
  const [newChatName, setNewChatName] = useState("");

  const chatList = useMemo(() => (Array.isArray(chats) ? chats : []), [chats]);

  useEffect(() => {
    if (!activeChat && chatList.length > 0) {
      setActiveChat(chatList[0].id);
      fetchMessages(chatList[0].id);
    }
  }, [activeChat, chatList, fetchMessages]);

  const handleSend = async () => {
    if (!activeChat) return;
    await sendMessage(activeChat, messageBody);
    setMessageBody("");
  };

  const handleCreateChat = async () => {
    if (!newChatName.trim()) return;
    setCreatingChat(true);
    await createChat(newChatName, []);
    setNewChatName("");
    setCreatingChat(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Chats</CardTitle>
          <Button size="sm" variant="ghost" onClick={() => setCreatingChat((p) => !p)}>
            <PlusCircle className="mr-2 h-4 w-4" /> New
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {creatingChat ? (
            <div className="space-y-2 rounded-2xl border border-dashed border-primary/40 p-3">
              <Input
                placeholder="Chat name"
                value={newChatName}
                onChange={(event) => setNewChatName(event.target.value)}
              />
              <Button onClick={handleCreateChat} disabled={!newChatName || loadingChats}>
                Create chat
              </Button>
            </div>
          ) : null}
          {loadingChats ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {chatList.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    setActiveChat(chat.id);
                    fetchMessages(chat.id);
                  }}
                  className={`flex w-full flex-col gap-1 rounded-xl border px-3 py-2 text-left transition-colors ${
                    activeChat === chat.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-transparent bg-muted/20 hover:bg-muted"
                  }`}
                >
                  <span className="text-sm font-semibold">{chat.name}</span>
                  <span className="text-xs text-muted-foreground">{chat.updated}</span>
                </button>
              ))}
              {chatList.length === 0 ? (
                <p className="text-sm text-muted-foreground">No chats yet. Create one to get started.</p>
              ) : null}
            </div>
          )}
          {error ? <Badge variant="outline">{error}</Badge> : null}
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>{chatList.find((chat) => chat.id === activeChat)?.name ?? "Messages"}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl bg-muted/20 p-4 scrollbar-thin">
            {loadingMessages ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : activeChat ? (
              messages[activeChat]?.length ? (
                messages[activeChat].map((message) => (
                  <div key={message.id} className="max-w-md rounded-2xl bg-primary/10 p-3">
                    <p className="text-sm">{message.body}</p>
                    <span className="text-xs text-muted-foreground">{message.created}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No messages yet.</p>
              )
            ) : (
              <p className="text-sm text-muted-foreground">Select a chat to view messages.</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Textarea
              placeholder="Type your message"
              value={messageBody}
              onChange={(event) => setMessageBody(event.target.value)}
            />
            <Button className="self-end" onClick={handleSend} disabled={!messageBody.trim()}>
              <Send className="mr-2 h-4 w-4" /> Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
