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
            <button className="rounded-md bg-blue-600 text-white hover:text-blue-600 hover:bg-white hover:border-blue-600 border px-2 py-1">
              {'Add'}
            </button>
          </Link>
        )}
      </>
    );
  }

  const name = searchParams?.name;

  if (!name) {
    return <TeamSelector teams={teams} currentTeam={name} />;
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
    <>
      {' '}
      <TeamSelector teams={teams} currentTeam={name} />
      {teamData && (
        <>
          <h3 className="font-bold text-xl">Team Details</h3>
          <div className="grid grid-cols-2 max-w-96">
            <h3>Team Name:</h3>
            <p>{team.name}</p>
            <h3>Ranking:</h3>
            <p>{teamDataIndex + 1}</p>
            <h3>Registration Date:</h3>
            <p>{extractStringFromDate(team.regdate)}</p>
            <h3>Group:</h3>
            <p>{team.groupno}</p>
            <h3>Points:</h3>
            <p>{totalMatchPoints(teamData)}</p>
            <h3>Goals:</h3>
            <p>{teamData.goals}</p>
            <h3>Alt Points:</h3>
            <p>{totalAlternateMatchPoints(teamData)}</p>
          </div>

          <h3 className="font-bold text-xl">Matches</h3>
          {matches.length > 0 &&
            matches.map((match) => (
              <div
                key={`${match.namea}${match.nameb}`}
                className="flex justify-between max-w-96"
              >
                <p className="font-bold">{match.namea}</p>
                <p className="text-xl tracking-widest">
                  {match.goalsa}-{match.goalsb}
                </p>

                <p className="font-bold">{match.nameb}</p>
              </div>
            ))}
        </>
      )}
    </>
  );
}
