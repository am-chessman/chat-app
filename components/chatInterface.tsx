"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Session } from "next-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { socket } from "@/lib/socketClient";

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
    console.log("Room number in ChatInterface:", roomNumber);

    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get current user's name for comparison
    const currentUserName = session?.user?.name || "Anonymous";

    // Join room on mount
    useEffect(() => {
        socket.emit("join-room", {room: roomNumber, username: currentUserName});
        console.log(`User ${socket.id} joined room ${roomNumber}`);

        socket.on("message", ( data: {room: string, message: string, sender: string} ) => {
            console.log("Room number: ", roomNumber || "No room number");
            setMessages((prev) => [
                ...prev,
                {
                    sender: data.sender || "Anonymous",
                    message: data.message
                }
            ]);
        });

        socket.on("user_joined", (data: {sender: string, message: string}) => {
            setMessages((prev) => [
                ...prev,
                {
                    sender: data.sender,
                    message: data.message
                }
            ]);
        });

        return () => {
            socket.off("message");
            socket.off("user_joined");
        };
    }, [roomNumber, session, currentUserName]);

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
            // Handle file upload logic here
            setShowAttachmentMenu(false);
        }
    };

    const handleAttachmentClick = (type: string) => {
        switch (type) {
            case 'file':
                fileInputRef.current?.click();
                break;
            case 'image':
                // Handle image selection
                console.log("Image attachment clicked");
                break;
            case 'camera':
                // Handle camera access
                console.log("Camera attachment clicked");
                break;
            default:
                break;
        }
        setShowAttachmentMenu(false);
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 flex items-center justify-center">
            <div className="w-full max-w-4xl h-[90vh] bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">

                {/* Header */}
                <div className="bg-slate-800/60 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-white">ChatWave</h1>
                    </div>

                    <Link href="/my-profile">
                        <Avatar>
                            <AvatarFallback className="bg-slate-500 text-white">
                                {getInitials(currentUserName)}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                </div>

                {/* Messages */}
                <div className="flex-1 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-slate-400 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 right-16 w-40 h-40 bg-slate-600 rounded-full blur-3xl"></div>
                    </div>

                    <div className="h-full overflow-y-auto p-6 space-y-4">
                        {messages.map((msg, index) => {
                            const isCurrentUser = msg.sender === currentUserName;
                            const displayName = isCurrentUser ? "You" : msg.sender;
                            const isSystem = msg.sender === "system";

                            const isCurrentUserJoinMessage = isSystem &&
                                (msg.message.includes(`${currentUserName}`) ||
                                    msg.message.includes(`${currentUserName}`))

                            if (isSystem) {
                                if(isCurrentUserJoinMessage) return null;
                                return (
                                    <div key={index} className="flex justify-center">
                                        <div
                                            className="bg-slate-600/30 text-slate-300 text-sm px-4 py-2 rounded-xl italic">
                                            {msg.message}
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={index} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                                    <div className={`${isCurrentUser ? "bg-indigo-800 text-white rounded-br-md" : "bg-slate-700/50 text-slate-200 rounded-bl-md"} px-4 py-2 rounded-2xl max-w-xs lg:max-w-md`}>
                                        <span className="block text-xs opacity-70">{displayName}</span>
                                        {msg.message}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Input */}
                <div className="bg-slate-800/60 border-t border-slate-700/30 p-6 flex-shrink-0 relative">
                    {/* Attachment Menu */}
                    {showAttachmentMenu && (
                        <div className="absolute bottom-20 left-6 bg-slate-700/90 backdrop-blur-xl border border-slate-600/50 rounded-xl shadow-xl p-2 z-10">
                            <div className="flex flex-col gap-1">
                                <button
                                    onClick={() => handleAttachmentClick('file')}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-600/50 rounded-lg transition-colors text-slate-200 hover:text-white"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                    <span className="text-sm">File</span>
                                </button>
                                <button
                                    onClick={() => handleAttachmentClick('image')}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-600/50 rounded-lg transition-colors text-slate-200 hover:text-white"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm">Image</span>
                                </button>
                                <button
                                    onClick={() => handleAttachmentClick('camera')}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-600/50 rounded-lg transition-colors text-slate-200 hover:text-white"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-sm">Camera</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                        accept="*/*"
                    />

                    <form onSubmit={handleSend} className="flex items-center gap-3">
                        {/* Attachment button */}
                        <button
                            type="button"
                            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                            className={`${
                                showAttachmentMenu
                                    ? 'bg-slate-600 rotate-45'
                                    : 'bg-slate-700/50 hover:bg-slate-600/50'
                            } border border-slate-600/50 text-white p-3 rounded-xl transition-all duration-200 transform hover:scale-105`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>

                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Send a message..."
                            className="flex-1 bg-slate-700/50 border border-slate-600/50 text-white placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none"
                        />

                        {/* Click outside to close menu */}
                        {showAttachmentMenu && (
                            <div
                                className="fixed inset-0 z-0"
                                onClick={() => setShowAttachmentMenu(false)}
                            ></div>
                        )}

                        <button
                            type="submit"
                            className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white p-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-slate-500/25"
                        >
                            <svg viewBox="0 0 24 24" height="20" width="20">
                                <path fill="currentColor" d="M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845 L1.101,21.757z"></path>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}