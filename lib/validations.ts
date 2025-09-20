import { z } from 'zod';

export const signUpSchema = z.object({
    email: z.email(),
    username: z.string().min(3).max(20),
    password: z.string().min(8).max(32),
})

export const signInSchema = z.object({
    email: z.email(),
    password: z.string().min(1).max(32),
})