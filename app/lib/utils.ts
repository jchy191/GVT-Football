import { z } from 'zod';
import {
  MatchPointsAssignment,
  MatchSchema,
  Table,
  Team,
  TeamDetails,
  TeamSchema,
} from './declaration';

export const points: MatchPointsAssignment = {
  normal: {
    win: 3,
    draw: 1,
    loss: 0,
  },
  alternate: {
    win: 5,
    draw: 2,
    loss: 1,
  },
};

export function totalMatchPoints(team: TeamDetails) {
  return (
    team.wins * points.normal.win +
    team.draws * points.normal.draw +
    team.losses * points.normal.loss
  );
}

export function totalAlternateMatchPoints(team: TeamDetails) {
  return (
    team.wins * points.alternate.win +
    team.draws * points.alternate.draw +
    team.losses * points.alternate.loss
  );
}

export function sortTable(table: Table) {
  table.sort((a: TeamDetails, b: TeamDetails) => {
    const pointsDiff = totalMatchPoints(b) - totalMatchPoints(a);
    if (pointsDiff != 0) return pointsDiff;

    const goalDiff = b.goals - a.goals;
    if (goalDiff != 0) return goalDiff;

    const altPointsDiff =
      totalAlternateMatchPoints(b) - totalAlternateMatchPoints(a);
    if (altPointsDiff != 0) return altPointsDiff;
    return a.regDate.valueOf() - b.regDate.valueOf();
  });
  return table;
}

export function parseTeams(formData: FormData): Team[] {
  if (!formData.get('teams')) {
    throw new Error('Please fill in the teams.');
  }
  const teams: Map<string, Team> = new Map();

  (formData.get('teams') as string).split('\r\n').forEach((team) => {
    const validatedFields = TeamSchema.safeParse({
      name: team.split(' ')[0],
      regDate: `2024-${team.split(' ')[1].split('/')[1]}-${team.split(' ')[1].split('/')[0]}`,
      group: team.split(' ')[2],
    });

    if (!validatedFields.success) {
      throw new Error(
        Object.values(validatedFields.error.flatten().fieldErrors).join(' ')
      );
    }

    const { name, regDate, group } = validatedFields.data;

    teams.set(name, {
      regDate: regDate,
      group: group,
      name: name,
      gamesPlayed: 0,
    });
  });
  return Array.from(teams.values());
}

export function validateTeams(teams: Team[], groupSize: number) {
  let group1Counter: number = 0;
  let group2Counter: number = 0;

  teams.forEach((team) => {
    if (team.group === '1') group1Counter++;
    else group2Counter++;
  });

  if (group1Counter !== groupSize)
    throw new Error(
      `Group 1 has ${group1Counter} team(s) instead of ${groupSize}`
    );
  if (group2Counter !== groupSize)
    throw new Error(
      `Group 2 has ${group2Counter} team(s) instead of ${groupSize}`
    );
}

export function parseAndValidateMatches(
  teamsData: Team[],
  formData: FormData,
  groupSize: number = 6
) {
  if (!formData.get('matches')) {
    throw new Error('Please fill in the matches played.');
  }
  const teamNames = teamsData.map((team) => team.name) as [string, ...string[]];
  const schema = MatchSchema(teamNames);
  type Match = z.infer<typeof schema>;
  const matches: Map<string, Match> = new Map();

  (formData.get('matches') as string).split('\r\n').forEach((match) => {
    const validatedFields = schema.safeParse({
      teamA: match.split(' ')[0],
      teamB: match.split(' ')[1],
      goalsA: match.split(' ')[2],
      goalsB: match.split(' ')[3],
    });

    if (!validatedFields.success) {
      throw new Error(
        Object.values(validatedFields.error.flatten().fieldErrors).join(' ')
      );
    }

    const { teamA, teamB, goalsA, goalsB } = validatedFields.data;

    const teamADetails = teamsData.find((team) => team.name === teamA) as Team;
    const teamBDetails = teamsData.find((team) => team.name === teamB) as Team;

    if (teamADetails.group !== teamBDetails.group) {
      throw new Error('Teams can only play other teams in the same group.');
    }
    const mapKey = [teamA, teamB].sort().join();
    if (matches.get(mapKey)) {
      throw new Error('Each team can only play another team once.');
    }

    (teamADetails.gamesPlayed as number)++;
    (teamBDetails.gamesPlayed as number)++;

    matches.set(mapKey, {
      teamA,
      teamB,
      goalsA,
      goalsB,
    });
  });

  teamsData.forEach((team: Team) => {
    if (team.gamesPlayed !== groupSize - 1) {
      throw new Error(
        `${team.name} only played ${team.gamesPlayed} out of ${groupSize - 1} game(s).`
      );
    }
  });
  return Array.from(matches.values());
}
