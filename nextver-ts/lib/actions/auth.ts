'use server'
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import {signIn} from '@/auth';

export const SignInWithCredentials = async(params: Pick<AuthCredentials, "email" | "password">) => {
    const { email, password } = params;
    try {
        const result = await signIn('credentials', {
            email, password, redirect: false
        });

        if(result?.error) {
            return { success: false, message: result.error}
        }
    } catch (error) {
        console.error('SignIn error:', error);
        return { success: false, message: 'An error occurred during sign in'}
    }

    return { success: true };
}

export const SignUp = async(params: AuthCredentials) => {
    const { username, email, password } = params;

    const existingUser = await db
        .select().from(users)
        .where(eq(users.email, email))
        .limit(1);

    if(existingUser.length > 0) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db.insert(users).values({
            username,
            email,
            password: hashedPassword,
        });

        await SignInWithCredentials({ email, password });
        return { success: true };
    } catch (error) {
        console.error('SignUp error:', error);
        return { success: false, message: 'An error occurred during sign up' };
    }
}