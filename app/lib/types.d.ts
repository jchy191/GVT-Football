import User from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: User;
  }
  interface User {
    role: 'admin' | 'user';
  }
}

declare module 'next-auth/jwt' {
  type JWT = User;
}
