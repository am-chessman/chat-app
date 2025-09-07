"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Users,
    Hash,
    ArrowRight,
    Plus,
    MessageCircle
} from 'lucide-react';
import {useRouter} from "next/navigation";

export default function JoinRoomUI() {
    const [roomNumber, setRoomNumber] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const router = useRouter()

    const handleJoinRoom = async () => {
        if (!roomNumber.trim()) return;
        setIsJoining(true);

        router.push(`/room/${roomNumber}`);

        setTimeout(() => {
            console.log(`Joining room: ${roomNumber}`);
            setIsJoining(false);
        }, 1000);
    };

    const generateRandomRoom = () => {
        const randomRoom = Math.floor(100000 + Math.random() * 900000);
        setRoomNumber(randomRoom.toString());
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && roomNumber.trim() && !isJoining) {
            handleJoinRoom();
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Main Card */}
                <Card className="bg-gray-800/60 border-gray-700/50 backdrop-blur-sm">
                    <CardHeader className="text-center space-y-4">
                        {/* Icon */}
                        <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto flex items-center justify-center">
                            <MessageCircle className="w-8 h-8 text-gray-300" />
                        </div>

                        <div>
                            <CardTitle className="text-2xl font-semibold text-white">
                                Join ChatWave Room
                            </CardTitle>
                            <CardDescription className="text-gray-400 mt-2">
                                Enter a room number to join the conversation
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Join Room Section */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="roomNumber" className="text-sm font-medium text-gray-300">
                                    Room Number
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        id="roomNumber"
                                        type="text"
                                        placeholder="123456"
                                        value={roomNumber}
                                        onChange={(e) => setRoomNumber(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        className="bg-gray-700/60 border-gray-600/40 text-white placeholder:text-gray-400 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 pl-10"
                                        maxLength={6}
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleJoinRoom}
                                disabled={!roomNumber.trim() || isJoining}
                                className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 transition-all duration-200"
                            >
                                {isJoining ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Joining...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Join Room
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                )}
                            </Button>
                        </div>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-gray-800 px-3 text-gray-400">or</span>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={generateRandomRoom}
                                className="w-full cursor-pointer bg-gray-700/40 border-gray-600/40 text-gray-300 hover:bg-gray-700/60 hover:text-white transition-all duration-200"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Generate Random Room
                            </Button>
                        </div>

                        {/* Recent Rooms */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-300">Recent Rooms</h3>
                            <div className="space-y-2">
                                {['1234', '7890', '3456'].map((room) => (
                                    <button
                                        key={room}
                                        onClick={() => setRoomNumber(room)}
                                        className="w-full cursor-pointer text-left p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg border border-gray-600/30 hover:border-gray-600/50 transition-all duration-200 group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                                                    <Hash className="w-4 h-4 text-gray-300" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">Room {room}</p>
                                                    <p className="text-xs text-gray-400">Last joined 2h ago</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">
                        Don&#39;t have a room number?{' '}
                        <button
                            onClick={generateRandomRoom}
                            className="text-blue-400 hover:text-blue-300 underline transition-colors"
                        >
                            Create a new room
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}