"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Hash, MessageCircle, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const QUICK_ROOMS = ["123456", "789012", "345678"];

export default function JoinRoomUI() {
  const [roomNumber, setRoomNumber] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();

  const handleJoinRoom = async () => {
    const normalizedRoom = roomNumber.trim();
    if (!normalizedRoom || isJoining) return;

    setIsJoining(true);
    router.push(`/room/${normalizedRoom}`);
  };

  const generateRandomRoom = () => {
    const randomRoom = Math.floor(100000 + Math.random() * 900000);
    setRoomNumber(randomRoom.toString());
  };

  const canJoin = roomNumber.trim().length > 0 && !isJoining;

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_12%_20%,rgba(79,70,229,0.2),transparent_42%),radial-gradient(circle_at_88%_75%,rgba(14,165,233,0.16),transparent_38%),linear-gradient(180deg,#020617_0%,#0f172a_48%,#020617_100%)] px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/70 shadow-[0_18px_55px_-25px_rgba(15,23,42,0.95)] backdrop-blur-xl sm:rounded-3xl">
        <div className="grid min-h-[600px] lg:grid-cols-[1.1fr,1fr]">
          <aside className="hidden border-r border-slate-700/50 bg-slate-900/70 px-8 py-10 lg:block">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/20 ring-1 ring-indigo-300/20">
                <MessageCircle className="h-5 w-5 text-indigo-200" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">ChatWave</p>
                <h2 className="text-lg font-semibold text-white">Room Lobby</h2>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-slate-300">
              Join an existing room with a 6-digit code or generate a new one and share it. Same visual system as the
              chat room so the flow feels consistent end-to-end.
            </p>

            <div className="mt-8 space-y-3 rounded-2xl border border-slate-700/60 bg-slate-800/50 p-4">
              <p className="text-sm font-medium text-slate-100">How it works</p>
              <ul className="space-y-1 text-xs text-slate-400">
                <li>• Enter room code to join instantly</li>
                <li>• Generate and share a fresh room code</li>
                <li>• Start chatting in realtime with no setup</li>
              </ul>
            </div>
          </aside>

          <section className="px-5 py-6 sm:px-8 sm:py-10">
            <div className="mb-8 space-y-2 text-center lg:text-left">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Join room</p>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Enter your room code</h1>
              <p className="text-sm text-slate-300">Use a valid 6-digit code or create a new room code now.</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="roomNumber" className="block text-sm font-medium text-slate-200">
                  Room number
                </label>
                <div className="relative">
                  <Hash className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="roomNumber"
                    type="text"
                    inputMode="numeric"
                    placeholder="123456"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && canJoin) handleJoinRoom();
                    }}
                    className="h-12 border-slate-600 bg-slate-800 pl-10 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:ring-indigo-400/20"
                    maxLength={6}
                  />
                </div>
              </div>

              <Button
                onClick={handleJoinRoom}
                disabled={!canJoin}
                className="h-12 w-full bg-indigo-600 font-medium text-white transition-colors hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400"
              >
                {isJoining ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                    Joining room...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Join room
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wide">
                  <span className="bg-slate-900 px-3 text-slate-400">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={generateRandomRoom}
                className="h-11 w-full border-slate-600 bg-slate-800/60 text-slate-200 hover:bg-slate-700 hover:text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Generate random room code
              </Button>

              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Quick fill</p>
                {QUICK_ROOMS.map((room) => (
                  <button
                    key={room}
                    onClick={() => setRoomNumber(room)}
                    className="group flex w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-800/40 px-3 py-2.5 text-left transition-colors hover:border-slate-500 hover:bg-slate-800"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-100">Room {room}</p>
                      <p className="text-xs text-slate-400">Tap to prefill</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 transition-colors group-hover:text-slate-300" />
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
