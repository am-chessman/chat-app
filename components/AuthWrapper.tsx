// components/AuthWrapper.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface AuthWrapperProps {
    children: ReactNode;
    redirectTo?: string;
}

export default async function AuthWrapper({ children, redirectTo = "/sign-in" }: AuthWrapperProps) {
    const session = await auth();

    if (!session) {
        redirect(redirectTo);
    }

    return <>{children}</>;
}