import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import authConfig from './auth.config';
import { Adapter } from 'next-auth/adapters';

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  return {
    adapter: PrismaAdapter(prisma) as Adapter,
    ...authConfig,
  };
});
