import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function HomePage() {
    const session = await auth()

    return (
        <div>
        </div>
    )
}