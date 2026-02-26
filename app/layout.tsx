import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import {Toaster} from "sonner";
import {SessionProvider} from "next-auth/react";
import {auth} from "@/auth";

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: "Chatwave - Where Every Message Creates Ripples",
  description: "Join Chatwave and dive into dynamic conversations that make waves. Connect, share, and experience the power of messaging like never before.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()

    return (
    <html lang="en" className={`${jetbrainsMono.variable}`}>
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <SessionProvider session={session}>
        <body className="m-0 min-h-screen w-full font-mono antialiased" >
            { children}
            <Toaster />
        </body>
        </SessionProvider>
    </html>
  );
}
