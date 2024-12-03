// import { handlers } from "@/src/auth"; // Referring to the auth.ts we just created

import NextAuth from "next-auth";

import { authOptions } from "./config";

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

export const { GET, POST } = handlers;
