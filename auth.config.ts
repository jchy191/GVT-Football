import { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import { prisma } from './prisma';

export default {
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: `${profile.given_name} ${profile.family_name ? profile.family_name : ''}`,
          email: profile.email,
          image: profile.picture,
          role: profile.role,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user }) {
      const userObj = await prisma.user.findUnique({
        where: {
          email: user.email as string,
        },
      });
      if (!userObj) {
        return false;
      }
      if (!userObj.name) {
        await prisma.user.update({
          data: {
            name: user.name,
            image: user.image,
          },
          where: {
            email: user.email as string,
          },
        });
      }
      return true;
    },
    jwt({ token, user }) {
      return { ...token, ...user };
    },
    session({ session, token }) {
      session.user.role = token.role as 'user' | 'admin';
      session.user.image = token.image as string;
      session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: '/api/signin',
    error: '/api/error',
  },
} satisfies NextAuthConfig;
