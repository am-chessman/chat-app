import Chat from "@/components/chatInterface";
import { auth } from "@/auth";
import {redirect} from "next/navigation";

interface RoomPageProps {
    params: { roomNumber: string | number };
}

export default async function RoomPage({ params }: RoomPageProps) {
    const session = await auth();
    const { roomNumber } = params;

    if (!session) redirect("/sign-in")

    return (
            <Chat session={session} roomNumber={roomNumber} />
    );
}
