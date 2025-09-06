"use client"

import React from 'react'
import AuthForm from "@/components/AuthForm";
import {signUpSchema} from "@/lib/validations";
import { SignUp } from '@/lib/actions/auth';

const page = () => {
    return (
        <AuthForm
            type="SIGN_UP"
            schema={signUpSchema}
            defaultValues={
                {
                    email: "",
                    username: "",
                    password: ""
                }
            }
            onSubmit={SignUp}
        />
    )
}

export default page