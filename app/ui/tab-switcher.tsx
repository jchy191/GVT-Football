'use client';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

export default function TabSwitcher({
  tabs,
}: {
  tabs: { name: string; href: string; current: boolean }[];
}) {
  const pathname = usePathname();
  return (
    <div className="border-b border-gray-200">
      <div className="block">
        <nav className="-mb-px flex space-x-6">
          {tabs.map((tab) => (
            <a
              key={tab.name}
              href={tab.href}
              className={clsx(
                tab.href === pathname
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium'
              )}
            >
              {tab.name}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
