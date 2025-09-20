"use client"
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType } from 'zod'
import {DefaultValues, useForm, UseFormReturn, SubmitHandler, FieldValues, Path} from 'react-hook-form'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
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
    schema: ZodType<T>;
    defaultValues: T;
    onSubmit: (data: T) => Promise<{success: boolean; error?: string}>;
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
    const form: UseFormReturn<T> = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>,
    })

    const handleSubmit: SubmitHandler<T> = async(data) => {
        const result = await onSubmit(data)
        if(result.success) {
            toast.success(isSignIn ? "Signed in successfully!" : "Account created successfully!", {duration: 2000})
            router.push("/join-room")
        }
        else {
            toast.error(result.error || "Something went wrong. Please try again.", {duration: 2000})
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Main form container */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                    {/* Header section */}
                    <div className="text-center mb-8">
                        <div className="mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-700 rounded-full mx-auto flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                            {isSignIn ? "Welcome back to Chatwave" : "Create your Chatwave account"}
                        </h1>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            {isSignIn
                                ? "Where Every Message Creates Ripples - Join the ChatWave Community"
                                : "Join Chatwave and Ride the Wave of Conversations"
                            }
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            {Object.keys(defaultValues).map((field) => (
                                <FormField
                                    control={form.control}
                                    name={field as Path<T>}
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-slate-200 font-medium">
                                                {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    required
                                                    type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                                                    placeholder={FIELD_PLACEHOLDERS[field.name as keyof typeof FIELD_NAMES]}
                                                    {...field}
                                                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-400 focus:ring-slate-400/20 rounded-lg h-12 transition-all duration-200"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400 text-xs" />
                                        </FormItem>
                                    )}
                                    key={field}
                                />
                            ))}

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] cursor-pointer shadow-lg hover:shadow-slate-500/25 h-12"
                            >
                                {isSignIn ? "Sign In" : "Create Account"}
                            </Button>
                        </form>
                    </Form>

                    {/* Footer link */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-300 text-sm">
                            {isSignIn ? "New to Chatwave? " : "Already have an account? "}
                            <Link
                                href={isSignIn ? "/sign-up" : "/sign-in"}
                                className="font-semibold text-slate-300 hover:text-white transition-colors duration-200 underline decoration-slate-400/50 hover:decoration-white/50 cursor-pointer underline-offset-2"
                            >
                                {isSignIn ? "Create an account" : "Sign in"}
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Optional decorative elements */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -top-40 -right-32 w-80 h-80 bg-slate-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-slate-600/10 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    )
}
export default AuthForm