import { NextAuthConfig, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { httpClient } from "@/src/services/base_api";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth";

export interface User {
  id: string;
  access_token: string;
  username: string;
  email?: string | null;
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

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // authorize: async (credentials) => {
      //   const { username, password } = credentials as {
      //     username: string;
      //     password: string;
      //   };

      //   if (!username || !password) {
      //     throw new Error("Missing username or password");
      //   }

      //   const response = await httpClient.post("/account/login", {
      //     username,
      //     password,
      //   });

      //   if (!response?.data?.data?.token) {
      //     throw new Error("Invalid credentials.");
      //   }

      //   return {
      //     access_token: response.data.data.token,
      //   };
      // },
      authorize: async (credentials) => {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        if (!username || !password) {
          throw new Error("Missing username or password");
        }

        const response = await httpClient.post("/account/login", {
          username,
          password,
        });
        // console.log("response auth", response);

        const token = response?.data?.data?.token;
        // console.log(1);
        // console.log(token);

        if (!token) {
          throw new Error("Invalid credentials.");
        }

        // Trả về một đối tượng kiểu `User`
        return {
          id: response.data.data.userId, // Hoặc trường ID từ API của bạn
          username,
          email: response.data.data.email, // Nếu API trả về email
          access_token: token,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }: { token: JWT; user: unknown }) {
      if (user) {
        token.user = user as User;
      }
      return token;
    },

    session({ session, token }: { session: Session; token: JWT }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
};

export const { signIn, signOut, handlers, auth } = NextAuth(authOptions);
