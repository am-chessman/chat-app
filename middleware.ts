export {auth as middleware} from "@/auth";
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    const isAuthPage = nextUrl.pathname.startsWith('/sign-in') ||
        nextUrl.pathname.startsWith('/sign-up')

    // Redirect logged-in users away from auth pages
    if (isAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL('/', nextUrl))
    }

    // Redirect non-logged-in users to sign-in (except for auth pages)
    if (!isAuthPage && !isLoggedIn) {
        return NextResponse.redirect(new URL('/sign-in', nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|icon.svg).*)'],
}