import {
  MatchPointsAssignment,
  MatchSchema,
  NewUser,
  NewUserSchema,
  Table,
  TeamDetails,
  TeamSchema,
} from './declaration';
import { Team, Match } from '@prisma/client';

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

export function extractStringFromDate(dateObj: Date) {
  const date =
    dateObj.getDate() < 10 ? `0${dateObj.getDate()}` : dateObj.getDate();
  const month =
    dateObj.getMonth() < 9
      ? `0${dateObj.getMonth() + 1}`
      : dateObj.getMonth() + 1;
  return `${date}/${month}`;
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
    return new Date(a.regdate).valueOf() - new Date(b.regdate).valueOf();
  });
  return table;
}

export function parseNewUserForm(formData: FormData): NewUser {
  if (!formData.get('email')) {
    throw new Error("Please fill in user's email.");
  }
  const validatedFields = NewUserSchema.safeParse({
    email: formData.get('email'),
    role: formData.get('role'),
  });
  if (!validatedFields.success) {
    throw new Error(
      Object.values(validatedFields.error.flatten().fieldErrors).join(' ')
    );
  }
  return validatedFields.data;
}

export function parseTeams(formData: FormData): Team[] {
  if (!formData.get('teams')) {
    throw new Error('Please fill in the teams.');
  }
  const teams: Team[] = [];

  (formData.get('teams') as string).split('\r\n').forEach((team, i) => {
    const validatedFields = TeamSchema.safeParse({
      name: team.split(' ')[0],
      regdate: `2024-${team.split(' ')[1].split('/')[1]}-${team.split(' ')[1].split('/')[0]}T00:00:00.000Z`,
      groupno: Number(team.split(' ')[2]),
    });

    if (!validatedFields.success) {
      throw new Error(
        `For line ${i + 1}: ${Object.values(validatedFields.error.flatten().fieldErrors).join(' ')}`
      );
    }

    const { name, regdate, groupno } = validatedFields.data;

    teams.push({
      regdate: regdate,
      groupno: groupno,
      name: name,
    });
  });
  return teams;
}

export function validateTeams(teams: Team[], groupSize: number = 6) {
  let group1Counter: number = 0;
  let group2Counter: number = 0;

  teams.forEach((team) => {
    if (team.groupno === 1) group1Counter++;
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

  const matches: Map<string, Match> = new Map();
  const gamesPlayed = Object.fromEntries(teamNames.map((team) => [team, 0]));

  (formData.get('matches') as string).split('\r\n').forEach((match, i) => {
    const validatedFields = schema.safeParse({
      namea: match.split(' ')[0],
      nameb: match.split(' ')[1],
      goalsa: match.split(' ')[2],
      goalsb: match.split(' ')[3],
    });

    if (!validatedFields.success) {
      throw new Error(
        `For line ${i + 1}: ${Object.values(validatedFields.error.flatten().fieldErrors).join(' ')}`
      );
    }

    const { namea, nameb, goalsa, goalsb } = validatedFields.data;
    const mapKey = [namea, nameb].sort((a, b) => a.localeCompare(b)).join();

    checkMatchIsBetweenTeamsInSameGroup(teamsData, namea, nameb);
    checkMatchIsUnique(mapKey, matches);

    gamesPlayed[namea]++;
    gamesPlayed[nameb]++;

    matches.set(mapKey, {
      order: i,
      namea,
      nameb,
      goalsa,
      goalsb,
    });
  });

  checkCorrectNumberOfMatches(gamesPlayed, groupSize);

  return Array.from(matches.values());
}

export function generateTableFromData(teams: Team[], matches: Match[]) {
  const table: Table = teams.map((team) => ({
    wins: 0,
    draws: 0,
    losses: 0,
    goals: 0,
    ...team,
  }));
  const teamMap = Object.fromEntries(table.map((table) => [table.name, table]));

  matches.forEach((match) => {
    teamMap[match.namea].goals += match.goalsa;
    teamMap[match.nameb].goals += match.goalsb;
    if (match.goalsa > match.goalsb) {
      teamMap[match.namea].wins++;
      teamMap[match.nameb].losses++;
    } else if (match.goalsa == match.goalsb) {
      teamMap[match.namea].draws++;
      teamMap[match.nameb].draws++;
    } else {
      teamMap[match.namea].losses++;
      teamMap[match.nameb].wins++;
    }
  });
  const group1 = table.filter((entry) => entry.groupno === 1);
  const group2 = table.filter((entry) => entry.groupno === 2);

  return { 1: sortTable(group1), 2: sortTable(group2) };
}

function checkMatchIsBetweenTeamsInSameGroup(
  teamsData: Team[],
  namea: string,
  nameb: string
) {
  const teamADetails = teamsData.find((team) => team.name === namea) as Team;
  const teamBDetails = teamsData.find((team) => team.name === nameb) as Team;

  if (teamADetails.groupno !== teamBDetails.groupno) {
    throw new Error('Teams can only play other teams in the same group.');
  }
}

function checkMatchIsUnique(mapKey: string, matches: Map<string, unknown>) {
  if (matches.get(mapKey)) {
    throw new Error('Each team can only play another team once.');
  }
}

function checkCorrectNumberOfMatches(
  gamesPlayed: { [k: string]: number },
  groupSize: number
) {
  Object.entries(gamesPlayed).forEach((team) => {
    const [name, games] = team;
    if (games !== groupSize - 1) {
      throw new Error(
        `${name} only played ${games} out of ${groupSize - 1} game(s).`
      );
    }
  });
}
