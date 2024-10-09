import { generateTableFromData } from './utils';
import { prisma } from '@/prisma';

export async function fetchTable() {
  try {
    const teams = await prisma.team.findMany();
    const matches = await prisma.match.findMany();
    return generateTableFromData(teams, matches);
  } catch {
    throw new Error('Failed to fetch table data.');
  }
}

export async function fetchTeamData(name: string) {
  try {
    const team = await prisma.team.findUnique({
      where: {
        name: name,
      },
      select: {
        name: true,
        regdate: true,
        groupno: true,
        matcha: true,
        matchb: true,
      },
    });

    return team;
  } catch {
    throw new Error(`Failed to fetch data for team ${name}`);
  }
}

export async function fetchAllTeams() {
  try {
    const teams = await prisma.team.findMany({ select: { name: true } });
    return teams.map((team) => team.name);
  } catch {
    throw new Error(`Failed to fetch all teams`);
  }
}

export async function fetchFormInputs() {
  try {
    const form = await prisma.form.findMany();

    return form[0];
  } catch {
    throw new Error(`Failed to fetch form input`);
  }
}

export async function fetchTotalLogsCount() {
  try {
    const count = await prisma.log.count();
    return count;
  } catch {
    throw new Error('Failed to fetch log count');
  }
}

export async function fetchLogs(skip: number, take: number) {
  try {
    const logs = await prisma.log.findMany({
      skip: skip,
      take: take,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        name: true,
        email: true,
        image: true,
        id: true,
        createdAt: true,
        formMatches: true,
        formTeams: true,
        action: true,
      },
    });
    return logs;
  } catch {
    throw new Error('Failed to fetch logs');
  }
}

export async function fetchUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users;
  } catch {
    throw new Error('Failed to fetch users');
  }
}
