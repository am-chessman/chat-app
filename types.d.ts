import {DefaultSession} from "next-auth";
import {User} from "@auth/core/types";

interface AuthCredentials {
    email: string;
    username: string;
    password: string;
}
