import { z } from 'zod';

export type TeamDetails = {
  name: string;
  regdate: Date;
  wins: number;
  draws: number;
  losses: number;
  goals: number;
  groupno: '1' | '2';
};

export type Match = {
  teama: string;
  teamb: string;
  goalsa: number;
  goalsb: number;
};

export type Table = TeamDetails[];

export type PointsAssignment = {
  win: number;
  draw: number;
  loss: number;
};

export type MatchPointsAssignment = {
  normal: PointsAssignment;
  alternate: PointsAssignment;
};

export const TeamSchema = z.object({
  name: z.string().max(255, 'Team name exceeds the character limit of 255.'),
  regdate: z.coerce.date(),
  groupno: z.enum(['1', '2'], {
    message: 'Invalid groupno number, expected 1 or 2.',
  }),
  gamesPlayed: z.number().optional(),
});

export type Team = z.infer<typeof TeamSchema>;

export const MatchSchema = (teams: [string, ...string[]]) =>
  z.object({
    teamA: z.enum(teams, {
      message: 'Invalid team name, team does not exist.',
    }),
    teamB: z.enum(teams, {
      message: 'Invalid team name, team does not exist.',
    }),
    goalsA: z.coerce.number({ message: 'Invalid input for goals scored.' }),
    goalsB: z.coerce.number({ message: 'Invalid input for goals scored.' }),
  });
