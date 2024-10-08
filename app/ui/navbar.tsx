import Image from 'next/image';
import SignOut from './signout-button';
import { auth } from '@/auth';
import SignIn from './signin-button';
import LoginError from './login-error';

export default async function NavBar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 bg-white mb-8">
      <div className=" w-full shadow-md">
        <nav
          aria-label="Global"
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4"
        >
          <div className="flex gap-4 ml-auto items-center">
            {session && session.user ? (
              <>
                <p className="text-gray-500">Welcome, {session.user.name}</p>
                <Image
                  src={session.user.image ?? ''}
                  alt={session.user.name ?? ''}
                  className=" rounded-full"
                  width={32}
                  height={32}
                />
                <SignOut />
              </>
            ) : (
              <>
                <LoginError />
                <SignIn />
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
