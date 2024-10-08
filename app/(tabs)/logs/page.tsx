import { fetchLogs } from '@/app/lib/data';
import LogEntry from '@/app/ui/log-entry';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect('/');
  }
  const logs = await fetchLogs();
  return (
    <div className="mt-4">
      <h2 className="font-bold text-xl mb-3">Logs</h2>
      {logs.map((log) => (
        <LogEntry log={log} key={log.id} />
      ))}
    </div>
  );
}
