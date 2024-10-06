import { sql } from '@vercel/postgres';
import { Match, Team } from './declaration';

export async function fetchTable() {
  try {
    const teams = await sql<Team>`SELECT * from teams`;
    const matches = await sql<Match>`SELECT * from matches`;

    return { teams: teams.rows, matches: matches.rows };
  } catch {
    throw new Error('Failed to fetch table data.');
  }
}

export async function fetchTeamMatches(name: string) {
  try {
    const team =
      await sql`select * from teams join matches on (teams.name = matches.teama OR teams.name = matches.teamb) where teams.name = '${name}';`;

    return team.rows;
  } catch {
    throw new Error(`Failed to fetch matches for team ${name}`);
  }
}
