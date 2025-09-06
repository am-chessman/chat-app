import { db } from "@/database/drizzle"
import { users } from "@/database/schema"

export default async function Home() {

    // const data = await db.select().from(users)
    // console.log(JSON.stringify(data, null, 2))
    //
    return (
        <>
            {/* <SignIn /> */}
        Home Page
        </>
    );
}