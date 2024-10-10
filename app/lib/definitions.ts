import { z } from 'zod';
import Fuse from 'fuse.js';

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
    errorMap: (issue, ctx) => ({
      message:
        issue.code === 'invalid_date'
          ? `Invalid date, required format is DD/MM.`
          : ctx.defaultError,
    }),
  }),
  groupno: z
    .string()
    .refine(
      (val) => Number(val) === 1 || Number(val) === 2,
      (val) => ({
        message: `Invalid group number "${val}", expected 1 or 2.`,
      })
    )
    .transform(Number),
});

export const MatchSchema = (teams: [string, ...string[]]) => {
  const fuse = new Fuse(teams);

  return z.object({
    namea: z.enum(teams, {
      errorMap: (_, ctx) => {
        const suggestion = fuse.search(ctx.data)[0].item;
        return {
          message: `Invalid team name, team "${ctx.data}" does not exist. Did you mean "${suggestion}"?`,
        };
      },
    }),
    nameb: z.enum(teams, {
      errorMap: (_, ctx) => {
        const suggestion = fuse.search(ctx.data)[0].item;
        return {
          message: `Invalid team name, team "${ctx.data}" does not exist. Did you mean "${suggestion}"?`,
        };
      },
    }),
    goalsa: z
      .string()
      .refine(
        (val) => Number(val) || Number(val) === 0,
        (val) => ({
          message: `Invalid number of goals "${val}" for the first team.`,
        })
      )
      .transform(Number),
    goalsb: z
      .string()
      .refine(
        (val) => Number(val) || Number(val) === 0,
        (val) => ({
          message: `Invalid number of goals "${val}" for the second team.`,
        })
      )
      .transform(Number),
  });
};

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
