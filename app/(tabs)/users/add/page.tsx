import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AddUserForm from '@/app/(tabs)/users/add/add-user-form';

export default async function Home() {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <>
      <h2 className="text-xl font-semibold mt-6">
        Add details for a new user:
      </h2>
      <AddUserForm />
    </>
  );
}
