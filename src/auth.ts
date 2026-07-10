import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth, { type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import { verifyPassword } from '@/lib/auth/password'
import { prisma } from '@/lib/db'
import { credentialsSchema } from '@/lib/validations/auth'

const providers: NextAuthConfig['providers'] = [
  Credentials({
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    authorize: async (raw) => {
      const parsed = credentialsSchema.safeParse(raw)
      if (!parsed.success) return null

      const { email, password } = parsed.data
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user?.hashedPassword) return null

      const valid = await verifyPassword(password, user.hashedPassword)
      if (!valid) return null

      return { id: user.id, name: user.name, email: user.email, image: user.image }
    },
  }),
]

// Only enable GitHub OAuth when credentials are configured, so the app runs
// out of the box without them.
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user && typeof token.id === 'string') {
        session.user.id = token.id
      }
      return session
    },
  },
})
