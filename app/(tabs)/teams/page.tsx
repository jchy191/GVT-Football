import { fetchAllTeams, fetchTable, fetchTeamData } from '../../lib/data';
import {
  extractStringFromDate,
  totalAlternateMatchPoints,
  totalMatchPoints,
} from '../../lib/utils';
import TeamSelector from './team-selector';

export default async function Page({
  searchParams,
}: {
  searchParams: { name?: string };
}) {
  const teams = await fetchAllTeams();
  console.log(teams);

  if (teams.length === 0) {
    return <p>select team</p>;
  }

  const name = searchParams?.name;

  if (!name) {
    return <TeamSelector teams={teams} currentTeam={name} />;
  }

  const table = await fetchTable();

  const matches = await fetchTeamData(name);
  const teamDataIndex = table[matches[0].groupno].findIndex(
    (team) => team.name === name
  );
  const teamData = table[matches[0].groupno][teamDataIndex];

  return (
    <>
      <TeamSelector teams={teams} currentTeam={name} />
      {teamData && (
        <>
          <h3 className="font-bold text-xl">Team Details</h3>
          <div className="grid grid-cols-2 max-w-96">
            <h3>Team Name:</h3>
            <p>{teamData.name}</p>
            <h3>Ranking:</h3>
            <p>{teamDataIndex + 1}</p>
            <h3>Registration Date:</h3>
            <p>{extractStringFromDate(teamData.regdate)}</p>
            <h3>Group:</h3>
            <p>{teamData.groupno}</p>
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
                key={`${match.teama}${match.teamb}`}
                className="flex justify-between max-w-96"
              >
                <p className="font-bold">{match.teama}</p>
                <p className="text-xl tracking-widest">
                  {match.goalsa}-{match.goalsb}
                </p>

                <p className="font-bold">{match.teamb}</p>
              </div>
            ))}
        </>
      )}
    </>
  );
}
