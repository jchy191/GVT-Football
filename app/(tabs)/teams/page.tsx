import Link from 'next/link';
import { fetchAllTeams } from '../../lib/data';
import TeamSelector from './team-selector';
import { auth } from '@/auth';
import TeamData from './team-data';
import { Suspense } from 'react';
import Loading from '../loading';

export default async function Page({
  searchParams,
}: Readonly<{
  searchParams: { name?: string };
}>) {
  const session = await auth();
  const teams = await fetchAllTeams();

  if (teams.length === 0) {
    return (
      <>
        {session?.user && (
          <Link href={'/edit'}>
            <button className="rounded-md bg-primary text-white hover:text-primary hover:bg-white hover:border-primary border px-2 py-1">
              {'Add'}
            </button>
          </Link>
        )}
      </>
    );
  }

  const name = searchParams?.name ?? '';

  return (
    <div className="mt-6">
      <TeamSelector teams={teams} currentTeam={name} />

      <Suspense fallback={<Loading />}>
        <TeamData currentTeam={name} />
      </Suspense>
    </div>
  );
}
