'use client';

import Image from 'next/image';
import type { User } from '@prisma/client';
import DeleteUser from './delete-user';

export default function UserEntry({ user }: { user: User }) {
  return (
    <div className="text-sm border-b border-t py-1">
      <div className="flex justify-between items-center h-8">
        <div className="mx-2 flex-initial basis-1/12">
          {user.image ? (
            <Image
              src={user.image ?? ''}
              alt={user.name ?? ''}
              className="rounded-full"
              width={32}
              height={32}
            />
          ) : (
            ' '
          )}
        </div>

        <p className="flex-initial basis-1/4">{user.name}</p>
        <p className="flex-initial basis-1/2">{user.email}</p>
        <p className="flex-initial basis-1/12">{user.role}</p>
        <div className="flex-initial basis-1/3 justify-center">
          <DeleteUser id={user.id} />
        </div>
      </div>
    </div>
  );
}
