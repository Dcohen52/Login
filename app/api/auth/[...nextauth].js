import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { Pool } from 'pg'

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "login_test_db",
  password: "56041361Dc",
  port: 5432,
});

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: {  label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [credentials.username]);
        const user = rows[0];

        if (user && user.password === credentials.password) {
          return { id: user.id, name: user.name, email: user.email }
        } else {
          return null
        }
      }
    })
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    jwt: async (token, user) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async (session, token) => {
      session.user.id = token.id;
      return session;
    },
  },
})
