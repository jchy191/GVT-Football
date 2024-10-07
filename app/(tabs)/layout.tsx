import TabSwitcher from '../tab-switcher';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <h1 className="text-3xl font-bold mb-5">Annual Football Championship</h1>
      <TabSwitcher />
      {children}
    </>
  );
}
