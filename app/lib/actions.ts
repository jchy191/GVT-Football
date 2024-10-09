'use server';

import {
  parseTeams,
  validateTeams,
  parseAndValidateMatches,
  parseNewUserForm,
} from './utils';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/prisma';
import { auth } from '@/auth';
import type { LogType } from '@prisma/client';
import { PrismaAdapter } from '@auth/prisma-adapter';
import cuid from 'cuid';
import { Adapter } from 'next-auth/adapters';
import { CreateTableFormState } from './declaration';

export async function createTable(
  groupSize: number,
  action: LogType,
  prevState: CreateTableFormState,
  formData: FormData
): Promise<CreateTableFormState> {
  let teams, matches;
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorised access.');
  }

  try {
    teams = parseTeams(formData);
    validateTeams(teams, groupSize);
  } catch (err) {
    const error = err as { message: string };
    return { errors: { teams: error.message } };
  }
  try {
    matches = parseAndValidateMatches(teams, formData);
  } catch (err) {
    const error = err as { message: string };
    return { errors: { matches: error.message } };
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
        data: matches.map((match) => ({
          order: match.order,
          namea: match.namea,
          nameb: match.nameb,
          goalsa: match.goalsa,
          goalsb: match.goalsb,
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
          action: action,
          formTeams: formData.get('teams')?.toString(),
          formMatches: formData.get('matches')?.toString(),
          name: session.user.name as string,
          image: session.user.image as string,
          email: session.user.email as string,
        },
      }),
    ]);
  } catch {
    return { errors: { other: 'Issues connecting to the database.' } };
  }

  revalidatePath('/');
  revalidatePath('/edit');
  revalidatePath('/teams');
  revalidatePath('/logs');
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
          action: 'DELETE',
          name: session.user.name as string,
          image: session.user.image as string,
          email: session.user.email as string,
        },
      }),
    ]);
  } catch {
    return 'Issues connecting to the database.';
  }

  revalidatePath('/');
  revalidatePath('/edit');
  revalidatePath('/teams');
  revalidatePath('/logs');
  return 'Successfully cleared data.';
}
export async function deleteLogs() {
  const session = await auth();
  if (!session || session?.user.role === 'admin') {
    throw new Error('Unauthorised access.');
  }
  try {
    await prisma.log.deleteMany({});
  } catch {
    return 'Issues connecting to the database.';
  }

  revalidatePath('/logs');
  return 'Successfully cleared logs.';
}

export async function createUser(previousState: string, formData: FormData) {
  const session = await auth();
  if (!session || session?.user.role !== 'admin') {
    throw new Error('Unauthorised access.');
  }
  let newUser;
  try {
    newUser = parseNewUserForm(formData);
  } catch (err) {
    const error = err as { message: string };
    return error.message;
  }
  try {
    const adapter = PrismaAdapter(prisma) as Adapter;
    if (adapter.createUser) {
      await adapter.createUser({
        id: cuid(),
        name: '',
        email: newUser.email,
        emailVerified: null,
        role: newUser.role,
      });
    }
  } catch {
    return 'Issues connecting to the database.';
  }
  revalidatePath('/users');
  redirect('/users');
}

export async function deleteUser(id: string) {
  const session = await auth();
  if (!session || session?.user.role !== 'admin') {
    throw new Error('Unauthorised access.');
  }
  if (session.user.id === id) {
    return 'Cannot delete yourself.';
  }
  try {
    const adapter = PrismaAdapter(prisma) as Adapter;
    if (adapter.deleteUser) {
      await adapter.deleteUser(id);
    }
    revalidatePath('/users');
    revalidatePath('/logs');
    return 'Successfully deleted user';
  } catch {
    return 'Issues connecting to the database.';
  }
}
