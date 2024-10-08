import { auth } from '@/auth';
import TabSwitcher from '../ui/tab-switcher';
import Container from '../ui/container';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tabs = [
    { name: 'Table', href: '/', current: true },
    { name: 'Individual Teams', href: '/teams', current: false },
  ];
  const session = await auth();
  if (session?.user) {
    tabs.push({ name: 'Logs', href: '/logs', current: false });
  }
  return (
    <Container>
      <h1 className="text-3xl font-bold mb-5">Annual Football Championship</h1>
      <TabSwitcher tabs={tabs} />
      {children}
    </Container>
  );
}
