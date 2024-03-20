import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"

export default NextAuth({
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    error: '/auth/error', // Redirect to this page in case of an error
  },
}).catch((error: Error) => {
  console.error('NextAuth error:', error);
});

