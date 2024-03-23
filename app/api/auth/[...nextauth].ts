// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiRequest, NextApiResponse } from "next";

export default async function auth(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  return await NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      AppleProvider({
        clientId: process.env.APPLE_CLIENT_ID,
        clientSecret: process.env.APPLE_CLIENT_SECRET,
      }),
      FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      }),
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" },
        },
        authorize: async (credentials) => {
          const user = { id: 1, name: "J Smith", email: "jsmith@example.com" };
          if (user) {
            return Promise.resolve(user);
          } else {
            return Promise.resolve(null);
          }
        },
      }),
    ],
  });
}
