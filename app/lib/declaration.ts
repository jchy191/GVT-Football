import { z } from 'zod';

export type TeamDetails = {
  regDate: Date;
  wins: number;
  draws: number;
  losses: number;
  goals: number;
  group: '1' | '2';
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
  regDate: z.string().date(),
  group: z.enum(['1', '2'], {
    message: 'Invalid group number, expected 1 or 2.',
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
