import {ReactNode} from 'react'
import {JetBrains_Mono} from "next/font/google";
import {auth} from "@/auth";
import {redirect} from "next/navigation";

const jetBrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    weight: ['400', '700']})


const Layout = async ({children}: {children: ReactNode}) => {
    const session = await auth()
    if (session) redirect ('/join-room')

    return (
        <main className={`w-full h-screen flex bg-slate-900  justify-center items-center ${jetBrainsMono.className}`}>
            {children}
        </main>
    )
}

export default Layout