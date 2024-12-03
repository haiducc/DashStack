import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { httpClient } from "@/src/services/base_api";
import { JWT } from "next-auth/jwt";

export interface User {
  id?: string;
  access_token?: string;
  username?: string;
  email?: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      username?: string;
      email?: string;
      access_token?: string;
    };
  }

  interface JWT {
    user?: {
      id?: string;
      username?: string;
      email?: string;
      access_token?: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (
        credentials: Partial<Record<"username" | "password", string>>
      ) => {
        if (!credentials || !credentials.username || !credentials.password) {
          throw new Error("Missing username or password");
        }

        const response = await httpClient.post("/account/login", {
          username: credentials.username,
          password: credentials.password,
        });

        if (!response?.data?.data?.token) {
          throw new Error("Invalid credentials.");
        }

        return {
          access_token: response.data.data.token,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }: { token?: string; user: User }) {
      if (user) {
        token.user = user as User;
      }
      return token;
    },
    session({ session, token }): Session {
      if (token.user) {
        (session.user as User) = token.user;
      }
      return session;
    },
  },
};
