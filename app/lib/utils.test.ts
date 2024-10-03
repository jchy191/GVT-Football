import { beforeEach, describe, expect, test } from '@jest/globals';
import {
  points,
  sortTable,
  totalAlternateMatchPoints,
  totalMatchPoints,
} from './utils';
import { Table, Team } from './declaration';

describe('totalMatchPoints', () => {
  const team: Team = {
    name: 'Team',
    regDate: new Date(),
    wins: 0,
    draws: 0,
    losses: 0,
    goals: 0,
    group: 1,
  };
  beforeEach(() => {
    team.wins = 0;
    team.draws = 0;
    team.losses = 0;
  });
  test('should sum up wins correctly', () => {
    team.wins = 4;
    expect(totalMatchPoints(team)).toBe(4 * points.normal.win);
  });
  test('should sum up draws correctly', () => {
    team.draws = 3;
    expect(totalMatchPoints(team)).toBe(3 * points.normal.draw);
  });
  test('should sum up losses correctly', () => {
    team.losses = 6;
    expect(totalMatchPoints(team)).toBe(6 * points.normal.loss);
  });
  test('should sum up points correctly', () => {
    team.wins = 7;
    team.draws = 2;
    team.losses = 3;
    expect(totalMatchPoints(team)).toBe(
      7 * points.normal.win + 2 * points.normal.draw + 3 * points.normal.loss
    );
  });
});

describe('totalAlternateMatchPoints', () => {
  const team: Team = {
    name: 'Team',
    regDate: new Date(),
    wins: 0,
    draws: 0,
    losses: 0,
    goals: 0,
    group: 1,
  };
  beforeEach(() => {
    team.wins = 0;
    team.draws = 0;
    team.losses = 0;
  });
  test('should sum up wins correctly', () => {
    team.wins = 4;
    expect(totalAlternateMatchPoints(team)).toBe(4 * points.alternate.win);
  });
  test('should sum up draws correctly', () => {
    team.draws = 3;
    expect(totalAlternateMatchPoints(team)).toBe(3 * points.alternate.draw);
  });
  test('should sum up losses correctly', () => {
    team.losses = 6;
    expect(totalAlternateMatchPoints(team)).toBe(6 * points.alternate.loss);
  });
  test('should sum up points correctly', () => {
    team.wins = 7;
    team.draws = 2;
    team.losses = 3;
    expect(totalAlternateMatchPoints(team)).toBe(
      7 * points.alternate.win +
        2 * points.alternate.draw +
        3 * points.alternate.loss
    );
  });
});

describe('sortTable', () => {
  const teamA: Team = {
    name: 'Team',
    regDate: new Date(),
    wins: 0,
    draws: 0,
    losses: 0,
    goals: 0,
    group: 1,
  };
  const teamB: Team = {
    name: 'Team',
    regDate: new Date(),
    wins: 0,
    draws: 0,
    losses: 0,
    goals: 0,
    group: 1,
  };
  const table: Table = [teamA, teamB];
  beforeEach(() => {
    teamA.wins = 0;
    teamA.draws = 0;
    teamA.losses = 0;
    teamA.goals = 0;
    teamA.regDate = new Date();
    teamA.regDate.setMonth(1, 1);
    teamB.wins = 0;
    teamB.draws = 0;
    teamB.losses = 0;
    teamB.goals = 0;
    teamB.regDate = new Date();
    teamB.regDate.setMonth(1, 1);
  });
  test('should sort by total points first', () => {
    teamA.wins = 4;
    teamB.wins = 9;
    teamA.goals = 10;
    teamB.goals = 2;
    teamA.regDate.setMonth(1, 1);
    teamB.regDate.setMonth(11, 11);
    expect(sortTable(table)).toStrictEqual([teamB, teamA]);
  });
  test('should sort by total goals second', () => {
    teamA.wins = 1;
    teamB.draws = 3;
    teamA.goals = 9;
    teamB.goals = 11;
    teamA.regDate.setMonth(1, 1);
    teamB.regDate.setMonth(11, 11);
    expect(sortTable(table)).toStrictEqual([teamB, teamA]);
  });
  test('should sort by alternative match points third', () => {
    teamA.wins = 1;
    teamB.draws = 3;
    teamA.goals = 10;
    teamB.goals = 10;
    teamA.regDate.setMonth(1, 1);
    teamB.regDate.setMonth(11, 11);
    expect(sortTable(table)).toStrictEqual([teamB, teamA]);
  });
  test('should sort by earliest registration date finally', () => {
    teamA.regDate.setMonth(11, 11);
    teamB.regDate.setMonth(1, 1);
    expect(sortTable(table)).toStrictEqual([teamB, teamA]);
  });
});
