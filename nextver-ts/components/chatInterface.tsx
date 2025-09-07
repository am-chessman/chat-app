"use client";

import React, { useEffect, useState } from "react";
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
    roomNumber: string;
}

export default function ChatInterface({ session, roomNumber }: ChatInterfaceProps) {
    console.log("Room number in ChatInterface:", roomNumber);

    const [messages, setMessages] = useState<Message[]>([]);
    const [joined, setJoined] = useState(false);
    const [messageInput, setMessageInput] = useState("");

    // Get current user's name for comparison
    const currentUserName = session?.user?.name || "Anonymous";

    // Join room on mount
    useEffect(() => {
        socket.emit("join-room", {room: roomNumber, username: currentUserName});
        console.log(`User ${socket.id} joined room ${roomNumber}`);
        setJoined(true);

        // Incoming message handler
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
                }]);
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

        // Emit to server
        socket.emit("message", { ...newMessage, room: roomNumber });

        // Update local state
        // setMessages((prev) => [...prev, newMessage]);
        setMessageInput("");
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

                            if (isSystem) {
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
                <div className="bg-slate-800/60 border-t border-slate-700/30 p-6 flex-shrink-0">
                    <form onSubmit={handleSend} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Send a message..."
                            className="flex-1 bg-slate-700/50 border border-slate-600/50 text-white placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none"
                        />
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