import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
// Your own logic for dealing with plaintext password strings; be careful!
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        credentials: {
            email: {
                label: "Username",
                type: "text",
                placeholder: "chessman@chessman.com",
            },
            password: {
                label: "Password",
                type: "password",
                placeholder: "**********",
            },
        },
        authorize: async (credentials) => {
            let user = null
    
            // logic to salt and hash password
            const pwHash = bcrypt.compare(credentials.password)
    
            // logic to verify if the user exists
            user = await getUserFromDb(credentials.email, pwHash)
    
            if (!user) {
            // No user found, so this is their first attempt to login
            // Optionally, this is also the place you could do a user registration
            throw new Error("Invalid credentials.")
            }
    
            // return user object with their profile data
            return user
        },
        }),
    ],
})