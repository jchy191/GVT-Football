'use server';

import { parseTeams, validateTeams, parseAndValidateMatches } from './utils';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/prisma';
import { auth } from '@/auth';
import type { LogType } from '@prisma/client';

export async function createTable(
  groupSize: number = 6,
  action: LogType,
  prevState: string,
  formData: FormData
) {
  let teams, matches;
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorised access.');
  }

  try {
    teams = parseTeams(formData);
    validateTeams(teams, groupSize);

    matches = parseAndValidateMatches(teams, formData);
  } catch (err) {
    const error = err as { message: string };
    return error.message;
  }
  try {
    await prisma.$transaction([
      prisma.match.deleteMany({}),
      prisma.team.deleteMany({}),
      prisma.team.createMany({
        data: teams.map((team) => ({
          name: team.name,
          groupno: team.groupno,
          regdate: team.regdate,
        })),
      }),
      prisma.match.createMany({
        data: matches.map((match, i) => ({
          order: i,
          namea: match.nameA,
          nameb: match.nameB,
          goalsa: match.goalsA,
          goalsb: match.goalsB,
        })),
      }),
      prisma.form.deleteMany({}),
      prisma.form.create({
        data: {
          teams: formData.get('teams')?.toString() as string,
          matches: formData.get('matches')?.toString() as string,
        },
      }),
      prisma.log.create({
        data: {
          userId: session.user.id,
          action: action,
          formTeams: formData.get('teams')?.toString(),
          formMatches: formData.get('matches')?.toString(),
        },
      }),
    ]);
  } catch {
    return 'Issues connecting to the database.';
  }

  revalidatePath('/');
  revalidatePath('/edit');
  revalidatePath('/teams');
  redirect('/');
}

export async function deleteTable() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorised access.');
  }
  try {
    await prisma.$transaction([
      prisma.match.deleteMany({}),
      prisma.team.deleteMany({}),
      prisma.form.deleteMany({}),
      prisma.log.create({
        data: {
          userId: session.user.id,
          action: 'DELETE',
        },
      }),
    ]);
  } catch {
    return 'Issues connecting to the database.';
  }

  revalidatePath('/');
  revalidatePath('/edit');
  revalidatePath('/teams');
  return 'Successfully cleared data.';
}
