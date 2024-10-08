import { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Google({
      profile(profile) {
        return {
          id: profile.sub,
          name: `${profile.given_name} ${profile.family_name}`,
          email: profile.email,
          image: profile.picture,
          role: 'admin',
          //   role: profile.role,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!Object.hasOwn(user, 'emailVerified')) {
        return false;
      }
      return true;
    },
    jwt({ token, user }) {
      return { ...token, ...user };
    },
    session({ session, token }) {
      session.user.role = token.role;
      session.user.image = token.image;
      return session;
    },
  },
  pages: {
    signIn: '/api/signin',
    error: '/api/error',
  },
} satisfies NextAuthConfig;
