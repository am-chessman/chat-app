import Chat from "@/components/chatInterface";
import {auth} from "@/auth";
import {redirect} from "next/navigation";

export default async function Home({params}: {params: {page: number}}) {
    const session = await auth();
    if(!session){
        redirect("/sign-in")
    } else if(session && params.page === undefined) {
        redirect("/join-room")
    }


    if(session)
    {
        console.log(session)
    }

    const page = params.page;
    return (
        <>
            <Chat session={session} roomNumber={page} />
        </>
    );
}