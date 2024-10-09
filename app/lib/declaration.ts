import { z } from 'zod';

export type TeamDetails = {
  name: string;
  regdate: Date;
  wins: number;
  draws: number;
  losses: number;
  goals: number;
  groupno: number;
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

export const NewUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email.' }),
  role: z.enum(['admin', 'user'], {
    message: 'Invalid role.',
  }),
});

export type NewUser = z.infer<typeof NewUserSchema>;

export const TeamSchema = z.object({
  name: z.string(),
  regdate: z.coerce.date({
    errorMap: (issue, { defaultError }) => ({
      message:
        issue.code === 'invalid_date'
          ? 'Invalid date, required format is DD/MM.'
          : defaultError,
    }),
  }),
  groupno: z
    .number({ message: 'Invalid group number, expected 1 or 2.' })
    .lte(2, {
      message: 'Invalid group number, expected 1 or 2.',
    })
    .gte(1, {
      message: 'Invalid group number, expected 1 or 2.',
    }),
  gamesPlayed: z.number().optional(),
});

export const MatchSchema = (teams: [string, ...string[]]) =>
  z.object({
    namea: z.enum(teams, {
      message: 'Invalid team name, team does not exist.',
    }),
    nameb: z.enum(teams, {
      message: 'Invalid team name, team does not exist.',
    }),
    goalsa: z.coerce.number({ message: 'Invalid input for goals scored.' }),
    goalsb: z.coerce.number({ message: 'Invalid input for goals scored.' }),
  });

export type UserFormInput = {
  teams: string;
  matches: string;
};
export type CreateTableFormState = {
  errors?: {
    teams?: string;
    matches?: string;
    other?: string;
  };
  message?: string | null;
};
