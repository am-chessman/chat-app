import Chat from "@/components/chatInterface";
import { auth } from "@/auth";
import {redirect} from "next/navigation";

interface RoomPageProps {
    params: { roomNumber: string | number};
}

export default async function RoomPage({ params }: RoomPageProps) {
    const session = await auth();
    const { roomNumber } = await params;

    if (!session) redirect("/sign-in")

    if (!roomNumber || roomNumber === '') {
        redirect("/join-room");
    }

    return (
            <Chat session={session} roomNumber={roomNumber} />
    );
}
