import { fetchTable, fetchTeamData } from '@/app/lib/data';
import {
  extractStringFromDate,
  totalMatchPoints,
  totalAlternateMatchPoints,
} from '@/app/lib/utils';

export default async function TeamData({
  currentTeam,
}: {
  currentTeam: string;
}) {
  const table = await fetchTable();

  const team = await fetchTeamData(currentTeam);
  if (!team) {
    return <></>;
  }

  const teamDataIndex = table[team?.groupno as 1 | 2].findIndex(
    (team) => team.name === currentTeam
  );
  const teamData = table[team?.groupno as 1 | 2][teamDataIndex];
  const matches = team.matcha
    .concat(team.matchb)
    .sort((a, b) => a.order - b.order);
  return (
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
  );
}
