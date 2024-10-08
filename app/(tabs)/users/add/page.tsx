import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AddUser from '@/app/ui/add-user';
import Container from '@/app/ui/container';

export default async function Home() {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <Container>
      <AddUser />
    </Container>
  );
}
