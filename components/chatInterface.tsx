"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { socket } from "@/lib/socketClient";
import {
  CheckCircle2,
  ChevronDown,
  ImageIcon,
  LogOut,
  Paperclip,
  Plus,
  Send,
  Users,
  Video,
} from "lucide-react";

interface Message {
  id?: string;
  message: string;
  sender: string;
}

interface ChatInterfaceProps {
  session: Session | null;
  roomNumber: string | number;
}

export default function ChatInterface({ session, roomNumber }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const currentUserName = session?.user?.name || "Anonymous";

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.emit("join-room", { room: roomNumber, username: currentUserName });

    const onMessage = (data: { room: string; message: string; sender: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: data.sender || "Anonymous",
          message: data.message,
        },
      ]);
    };

    const onUserJoined = (data: { sender: string; message: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: data.sender,
          message: data.message,
        },
      ]);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("message", onMessage);
    socket.on("user_joined", onUserJoined);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("message", onMessage);
      socket.off("user_joined", onUserJoined);
    };
  }, [roomNumber, currentUserName]);

  useEffect(() => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      message: messageInput,
      sender: currentUserName,
    };

    socket.emit("message", { ...newMessage, room: roomNumber });
    setMessageInput("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
      setShowAttachmentMenu(false);
    }
  };

  const handleAttachmentClick = (type: "file" | "image" | "camera") => {
    switch (type) {
      case "file":
        fileInputRef.current?.click();
        break;
      case "image":
        console.log("Image attachment clicked");
        break;
      case "camera":
        console.log("Camera attachment clicked");
        break;
      default:
        break;
    }
    setShowAttachmentMenu(false);
  };

  const hasMessages = messages.length > 0;
  const roomLabel = useMemo(() => `Room #${roomNumber}`, [roomNumber]);

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_12%_18%,rgba(79,70,229,0.2),transparent_42%),radial-gradient(circle_at_88%_75%,rgba(14,165,233,0.16),transparent_38%),linear-gradient(180deg,#020617_0%,#0f172a_48%,#020617_100%)] px-2 py-2 sm:px-4 sm:py-4">
      <div className="mx-auto flex h-[calc(100vh-1rem)] max-h-[980px] w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/70 shadow-[0_18px_55px_-25px_rgba(15,23,42,0.95)] backdrop-blur-xl sm:h-[calc(100vh-2rem)] sm:rounded-3xl">
        <section className="hidden w-72 shrink-0 border-r border-slate-700/50 bg-slate-900/75 px-4 py-5 lg:flex lg:flex-col">
          <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">Current space</p>
          <h2 className="text-lg font-semibold text-white">{roomLabel}</h2>
          <p className="mt-1 text-sm text-slate-400">Private realtime room</p>

          <div className="mt-6 rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <CheckCircle2 className={`h-4 w-4 ${isConnected ? "text-emerald-400" : "text-amber-300"}`} />
              {isConnected ? "Connected" : "Reconnecting"}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Message delivery is live while connected. If connection drops, chat will resume automatically.
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-700/50 bg-slate-800/40 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
              <Users className="h-4 w-4 text-indigo-300" />
              Room quick info
            </div>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• Secure room ID sharing</li>
              <li>• Realtime event sync</li>
              <li>• Attachment hooks ready</li>
            </ul>
          </div>
        </section>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-700/60 bg-slate-900/80 px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">ChatWave room</p>
                <h1 className="truncate text-base font-semibold text-white sm:text-lg">{roomLabel}</h1>
                <p className="text-xs text-slate-400 sm:text-sm">
                  {isConnected ? "Live conversation" : "Trying to reconnect"}
                </p>
              </div>

              <div ref={profileMenuRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                  aria-expanded={showProfileMenu}
                  aria-label="Open profile menu"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-600/80 bg-slate-800/70 px-2 py-1.5 text-slate-200 transition-colors hover:bg-slate-700/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <Avatar className="h-8 w-8 border border-slate-600/60 bg-slate-700">
                    <AvatarFallback className="bg-slate-700 text-xs text-slate-100">
                      {getInitials(currentUserName)}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 top-[calc(100%+0.5rem)] z-40 w-56 rounded-xl border border-slate-600/70 bg-slate-800/95 p-1.5 shadow-2xl backdrop-blur">
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-medium text-slate-100">{currentUserName}</p>
                      <p className="text-xs text-slate-400">Signed in</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/sign-in" })}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-200 transition-colors hover:bg-red-500/10 hover:text-red-100"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {!isConnected && (
            <div className="border-b border-amber-300/20 bg-amber-500/10 px-4 py-2 text-xs text-amber-200 sm:px-5">
              Connection lost. Messages will send once connection is restored.
            </div>
          )}

          <main className="relative flex-1 overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-20">
              <div className="absolute -top-12 left-1/4 h-44 w-44 rounded-full bg-indigo-500/20 blur-3xl" />
              <div className="absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
            </div>

            <div
              ref={messagesContainerRef}
              className="relative z-10 h-full overflow-y-auto px-3 py-4 sm:px-5 sm:py-6"
              aria-live="polite"
              aria-label="Chat messages"
            >
              {!hasMessages ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                  <p className="text-sm font-medium text-slate-200 sm:text-base">This room is waiting for the first message</p>
                  <p className="max-w-xs text-xs text-slate-400 sm:text-sm">
                    Share the room code and kick things off.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {messages.map((msg, index) => {
                    const isCurrentUser = msg.sender === currentUserName;
                    const isSystem = msg.sender === "system";
                    const isCurrentUserJoinMessage =
                      isSystem && msg.message.includes(currentUserName);

                    if (isSystem) {
                      if (isCurrentUserJoinMessage) return null;
                      return (
                        <div key={`${msg.sender}-${index}`} className="flex justify-center px-4">
                          <div className="rounded-full border border-slate-700/70 bg-slate-800/80 px-3 py-1.5 text-xs italic text-slate-300 sm:text-sm">
                            {msg.message}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={`${msg.sender}-${index}`} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm sm:max-w-[72%] sm:px-4 sm:py-3 ${
                            isCurrentUser
                              ? "rounded-br-md bg-indigo-600 text-indigo-50"
                              : "rounded-bl-md border border-slate-700/70 bg-slate-800 text-slate-100"
                          }`}
                        >
                          <p className={`mb-1 text-[11px] font-medium ${isCurrentUser ? "text-indigo-200" : "text-slate-400"}`}>
                            {isCurrentUser ? "You" : msg.sender}
                          </p>
                          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{msg.message}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </main>

          <div className="relative border-t border-slate-700/60 bg-slate-900/90 px-3 py-3 sm:px-5 sm:py-4">
            {showAttachmentMenu && (
              <>
                <button
                  aria-label="Close attachment menu"
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setShowAttachmentMenu(false)}
                />
                <div className="absolute bottom-[calc(100%+0.5rem)] left-3 z-20 w-52 rounded-xl border border-slate-600/70 bg-slate-800/95 p-1.5 shadow-2xl backdrop-blur sm:left-5">
                  <button
                    onClick={() => handleAttachmentClick("file")}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-700"
                  >
                    <Paperclip className="h-4 w-4" /> File
                  </button>
                  <button
                    onClick={() => handleAttachmentClick("image")}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-700"
                  >
                    <ImageIcon className="h-4 w-4" /> Image
                  </button>
                  <button
                    onClick={() => handleAttachmentClick("camera")}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-700"
                  >
                    <Video className="h-4 w-4" /> Camera
                  </button>
                </div>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept="*/*"
            />

            <form onSubmit={handleSend} className="relative z-20 flex items-end gap-2 sm:gap-3">
              <button
                type="button"
                aria-label="Toggle attachment options"
                aria-expanded={showAttachmentMenu}
                onClick={() => setShowAttachmentMenu((prev) => !prev)}
                className={`rounded-xl border p-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 sm:p-3 ${
                  showAttachmentMenu
                    ? "border-slate-500 bg-slate-600 text-white"
                    : "border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                <Plus className={`h-4 w-4 transition-transform sm:h-5 sm:w-5 ${showAttachmentMenu ? "rotate-45" : ""}`} />
              </button>

              <input
                type="text"
                aria-label="Message input"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message"
                className="h-11 flex-1 rounded-xl border border-slate-600 bg-slate-800 px-3 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 sm:h-12 sm:px-4"
              />

              <button
                type="submit"
                aria-label="Send message"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-3 text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:px-4"
                disabled={!messageInput.trim()}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
