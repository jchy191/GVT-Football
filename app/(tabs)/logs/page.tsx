import { fetchLogs, fetchTotalLogsCount } from '@/app/lib/data';
import LogEntry from '@/app/ui/log-entry';
import Pagination from '@/app/ui/pagination';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const MAX_ITEMS_PER_PAGE = 10;

export default async function Page({
  searchParams,
}: Readonly<{
  searchParams: { page?: string };
}>) {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    redirect('/');
  }

  const currentPage = Number(searchParams?.page) || 1;
  const totalItems = await fetchTotalLogsCount();
  const totalPages = Math.ceil(totalItems / MAX_ITEMS_PER_PAGE);

  if (currentPage > totalPages) {
    redirect('/logs');
  }
  const logs = await fetchLogs(
    (currentPage - 1) * MAX_ITEMS_PER_PAGE,
    MAX_ITEMS_PER_PAGE
  );
  return (
    <div className="mt-4">
      <h2 className="font-bold text-xl mb-3">Logs</h2>
      {logs.map((log) => (
        <LogEntry log={log} key={log.id} />
      ))}
      <div className="mt-6 text-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
