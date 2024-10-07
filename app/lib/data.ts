import { sql } from '@vercel/postgres';
import { UserFormInput, Match, Team } from './declaration';
import { generateTableFromData } from './utils';

export async function fetchTable() {
  try {
    const teams = await sql<Team>`SELECT * from teams`;
    const matches = await sql<Match>`SELECT * from matches`;

    return generateTableFromData(teams.rows, matches.rows);
  } catch {
    throw new Error('Failed to fetch table data.');
  }
}

export async function fetchTeamData(name: string) {
  try {
    const matches = await sql<
      Team & Match
    >`select * from teams join matches on (teams.name = matches.teama OR teams.name = matches.teamb) where teams.name = ${name};`;

    return matches.rows;
  } catch {
    throw new Error(`Failed to fetch matches for team ${name}`);
  }
}

export async function fetchAllTeams() {
  try {
    const teams = await sql`select name from teams;`;

    return teams.rows.map((team) => team.name);
  } catch {
    throw new Error(`Failed to fetch all teams`);
  }
}

export async function fetchFormInputs() {
  try {
    const form = await sql<UserFormInput>`select * from form;`;

    return form.rows[0];
  } catch {
    throw new Error(`Failed to fetch form input`);
  }
}
