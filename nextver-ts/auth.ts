import NextAuth, { User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/database/drizzle"
import { users } from "@/database/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import {signInSchema} from "@/lib/zod";
import {ZodError} from "zod";

export const { handlers, signIn, auth } = NextAuth({
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            credentials: {
              email: {
                  label: "Email",
                  type: "email",
                  placeholder: "someone@example.com",
              },
              password: {
                  label: "Password",
                  type: "password",
                  placeholder: "********",
              }
            },
            async authorize(credentials) {
                console.log("➡️ [authorize] called with:", credentials)

                try {
                   if(!credentials?.email || !credentials?.password) {
                       console.log("❌ Missing email or password in credentials")
                       return null;
                   }

                   const { email, password } = await signInSchema.parseAsync(credentials);

                   const userResult = await db
                       .select().from(users)
                       .where(
                           eq(users.email, email))
                       .limit(1);

                   console.log(userResult);

                   if(userResult.length === 0) return null;

                   const foundUser = userResult[0];

                   const isPasswordValid = await bcrypt.compare(password, foundUser.password);

                   if(!isPasswordValid) {
                       console.log("Invalid credentials")
                       return null;
                   }
                   else {
                          console.log("Valid credentials")
                   }

                   return {
                       id: foundUser.id,
                       username: foundUser.username,
                       email: foundUser.email
                   } as User;
               } catch (error) {
                   if(error instanceof ZodError) {
                       console.error("🔥 Authentication error:", error)
                       return null;
                   }
                   console.error("Authentication error: ", error)
                     return null;
                }
            }
        }),
    ],

    pages: {
        signIn: '/sign-in',
    },

    callbacks: {
        async jwt ({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }

            return token;
        },

        async session ({ session, token }) {
            if(session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
            }

            return session;
        }
    }
})