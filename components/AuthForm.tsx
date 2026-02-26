"use client"
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

import { DefaultValues, useForm, SubmitHandler, FieldValues, Path, Resolver } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {FIELD_NAMES, FIELD_PLACEHOLDERS, FIELD_TYPES} from "@/constants";
import { useRouter } from 'next/navigation'
import {toast} from "sonner"

interface Props<T extends FieldValues> {
    schema: unknown;
    defaultValues: T;
    onSubmit: (data: T) => Promise<{ success: boolean; error?: string; message?: string }>;
    type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
    type,
    schema,
    defaultValues,
    onSubmit,
}: Props<T>) => {
    const router = useRouter()
    const isSignIn = type === "SIGN_IN"
    const form = useForm<T>({
        resolver: zodResolver(schema as never) as Resolver<T>,
        defaultValues: defaultValues as DefaultValues<T>,
    })

    const handleSubmit: SubmitHandler<T> = async(data) => {
        const result = await onSubmit(data)
        if(result.success) {
            toast.success(isSignIn ? "Signed in successfully!" : "Account created successfully!", {duration: 2000})
            router.push("/join-room")
        }
        else {
            toast.error(result.error || result.message || "Something went wrong. Please try again.", {duration: 2000})
        }
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-8 sm:py-12">
            <div className="mx-auto flex w-full max-w-md items-center justify-center">
                <div className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/20 ring-1 ring-indigo-300/20">
                            <svg className="h-7 w-7 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h1 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            {isSignIn ? "Welcome back" : "Create your account"}
                        </h1>
                        <p className="text-sm leading-relaxed text-slate-300">
                            {isSignIn
                                ? "Sign in and continue your conversations."
                                : "Join ChatWave and start chatting in seconds."
                            }
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                            {Object.keys(defaultValues).map((field) => (
                                <FormField
                                    control={form.control}
                                    name={field as Path<T>}
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-sm font-medium text-slate-200">
                                                {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    required
                                                    type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                                                    placeholder={FIELD_PLACEHOLDERS[field.name as keyof typeof FIELD_NAMES]}
                                                    {...field}
                                                    className="h-12 rounded-xl border-slate-600 bg-slate-800 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:ring-indigo-400/20"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-300" />
                                        </FormItem>
                                    )}
                                    key={field}
                                />
                            ))}

                            <Button
                                type="submit"
                                className="h-12 w-full rounded-xl bg-indigo-600 font-semibold text-white transition-colors hover:bg-indigo-500"
                            >
                                {isSignIn ? "Sign in" : "Create account"}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-7 text-center">
                        <p className="text-sm text-slate-300">
                            {isSignIn ? "New to ChatWave? " : "Already have an account? "}
                            <Link
                                href={isSignIn ? "/sign-up" : "/sign-in"}
                                className="font-semibold text-indigo-300 underline underline-offset-2 transition-colors hover:text-indigo-200"
                            >
                                {isSignIn ? "Create an account" : "Sign in"}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
            </div>
        </div>
    )
}
export default AuthForm
