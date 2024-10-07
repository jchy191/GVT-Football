'use client';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

const tabs = [
  { name: 'Table', href: '/', current: true },
  { name: 'Individual Teams', href: '/teams', current: false },
  { name: 'Logs', href: '/logs', current: false },
];

export default function TabSwitcher() {
  const pathname = usePathname();
  return (
    <div className="border-b border-gray-200 pb-5 sm:pb-0">
      <div className="sm:hidden">
        <select
          id="current-tab"
          name="current-tab"
          defaultValue={tabs.find((tab) => tab.current)?.name}
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-6 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="-mb-px flex space-x-8">
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
