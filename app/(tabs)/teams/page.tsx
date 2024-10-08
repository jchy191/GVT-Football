import Link from 'next/link';
import { fetchAllTeams, fetchTable, fetchTeamData } from '../../lib/data';
import {
  extractStringFromDate,
  totalAlternateMatchPoints,
  totalMatchPoints,
} from '../../lib/utils';
import TeamSelector from './team-selector';
import { auth } from '@/auth';

export default async function Page({
  searchParams,
}: {
  searchParams: { name?: string };
}) {
  const teams = await fetchAllTeams();
  const session = await auth();

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

  const name = searchParams?.name;

  if (!name) {
    return (
      <div className="mt-6">
        <TeamSelector teams={teams} currentTeam={name} />
      </div>
    );
  }

  const table = await fetchTable();

  const team = await fetchTeamData(name);
  if (!team) {
    return <></>;
  }

  const teamDataIndex = table[team?.groupno as 1 | 2].findIndex(
    (team) => team.name === name
  );
  const teamData = table[team?.groupno as 1 | 2][teamDataIndex];
  const matches = team.matcha
    .concat(team.matchb)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="mt-6">
      <TeamSelector teams={teams} currentTeam={name} />
      {teamData && (
        <>
          <h3 className="font-semibold text-xl mt-4">Team Details</h3>
          <div className="grid grid-cols-2 max-w-96">
            <p className="font-semibold">Team Name:</p>
            <p>{team.name}</p>
            <p className="font-semibold">Ranking:</p>
            <p>{teamDataIndex + 1}</p>
            <p className="font-semibold">Registration Date:</p>
            <p>{extractStringFromDate(team.regdate)}</p>
            <p className="font-semibold">Group:</p>
            <p>{team.groupno}</p>
            <p className="font-semibold">Points:</p>
            <p>{totalMatchPoints(teamData)}</p>
            <p className="font-semibold">Goals:</p>
            <p>{teamData.goals}</p>
            <p className="font-semibold">Alt Points:</p>
            <p>{totalAlternateMatchPoints(teamData)}</p>
          </div>

          <h3 className="font-bold text-xl mt-4">Matches</h3>
          {matches.length > 0 &&
            matches.map((match) => (
              <div
                key={`${match.namea}${match.nameb}`}
                className="flex justify-between max-w-96"
              >
                <p className="font-semibold flex-initial basis-1/6">
                  {match.namea}
                </p>
                <p className="text-xl tracking-widest flex-initial basis-2/3 text-center">
                  {match.goalsa}-{match.goalsb}
                </p>

                <p className="font-semibold flex-initial basis-1/6">
                  {match.nameb}
                </p>
              </div>
            ))}
        </>
      )}
    </div>
  );
}
