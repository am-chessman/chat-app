import React from 'react'
import {Button} from "@/components/ui/button";
import {signOut} from "@/auth";

const Page = () => {
    return (
        <form action={async() => {
            "use server"
            await signOut({ redirectTo: "/sign-in" });
        }}
        className="mb-10"
        >
            <Button>
                Logout
            </Button>
        </form>
    )
}
export default Page
