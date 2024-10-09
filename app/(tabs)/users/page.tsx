import { fetchUsers } from '@/app/lib/data';
import UserEntry from '@/app/ui/user-entry';
import { auth } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    redirect('/');
  }

  const users = await fetchUsers();
  const activeUsers = users.filter((user) => user.name);
  const pendingUsers = users.filter((user) => !user.name);

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-xl">Users</h2>
        <Link href={'/users/add'}>
          <button className="rounded-md font-semibold bg-primary text-white hover:text-primary hover:bg-white hover:border-primary border px-2 py-1.5">
            Add Users
          </button>
        </Link>
      </div>
      {activeUsers.map((user) => (
        <UserEntry user={user} key={user.id} />
      ))}
      {pendingUsers.length > 0 && (
        <>
          <h2 className="font-bold text-xl mt-8 mb-2">Awaiting Acceptance</h2>
          <p className="text-gray-500 mb-3">
            Users have to log into the website with their accounts to become an
            active user.
          </p>
          {pendingUsers.map((user) => (
            <UserEntry user={user} key={user.id} />
          ))}
        </>
      )}
    </div>
  );
}
