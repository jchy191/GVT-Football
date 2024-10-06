'use server';
import { db } from '@vercel/postgres';
import { parseTeams, validateTeams, parseAndValidateMatches } from './utils';
import { revalidatePath } from 'next/cache';

export async function createTable(
  groupSize: number = 6,
  prevState: string,
  formData: FormData
) {
  let teams, matches;
  try {
    teams = parseTeams(formData);
    validateTeams(teams, groupSize);

    matches = parseAndValidateMatches(teams, formData);
  } catch (err) {
    const error = err as { message: string };
    return error.message;
  }
  console.log(teams[0].regdate.toISOString());
  const client = await db.connect();
  try {
    await client.sql`BEGIN`;
    await client.sql`TRUNCATE teams`;
    await Promise.all(
      teams.map(
        (team) => client.sql`
    INSERT INTO teams (name, groupno, regdate) VALUES
    (${team.name}, ${team.groupno}, ${team.regdate.toISOString()})
    `
      )
    );
    await client.sql`TRUNCATE matches`;
    await Promise.all(
      matches.map(
        (match) => client.sql`
    INSERT INTO matches (teamA, teamB, goalsA, goalsB) VALUES
    (${match.teamA}, ${match.teamB}, ${match.goalsA}, ${match.goalsB})
    `
      )
    );
    await client.sql`COMMIT`;
  } catch {
    await client.sql`ROLLBACK`;
    return 'Issues connecting to the database.';
  }

  revalidatePath('/');
  return 'Success!';
}
