import { beforeEach, describe, expect, test } from '@jest/globals';
import {
  parseAndValidateMatches,
  parseTeams,
  points,
  sortTable,
  totalAlternateMatchPoints,
  totalMatchPoints,
  validateTeams,
} from './utils';
import { Table, Team, TeamDetails } from './declaration';

describe('totalMatchPoints', () => {
  const team: TeamDetails = {
    regDate: new Date(),
    wins: 0,
    draws: 0,
    losses: 0,
    goals: 0,
    group: '1',
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
  const team: TeamDetails = {
    regDate: new Date(),
    wins: 0,
    draws: 0,
    losses: 0,
    goals: 0,
    group: '1',
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
  const teamA: TeamDetails = {
    regDate: new Date(),
    wins: 0,
    draws: 0,
    losses: 0,
    goals: 0,
    group: '1',
  };
  const teamB: TeamDetails = {
    regDate: new Date(),
    wins: 0,
    draws: 0,
    losses: 0,
    goals: 0,
    group: '1',
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

describe('parseTeams', () => {
  const form: FormData = new FormData();
  beforeEach(() => {
    form.delete('teams');
    form.delete('matches');
  });

  test('should return an error message on blank input', () => {
    form.append('teams', '');
    expect(() => parseTeams(form)).toThrowError('Please fill in the teams.');
  });

  test('should return an error message if a team group is not 1 or 2', () => {
    form.append('teams', 'teamA 01/04 2\r\nteamB 01/04 3');
    expect(() => parseTeams(form)).toThrowError(
      'Invalid group number, expected 1 or 2.'
    );
  });
  test('should return an error message if a team registration date is wrongly formatted', () => {
    form.append('teams', 'teamA 01/04 1\r\nteamB 01/024 2');
    expect(() => parseTeams(form)).toThrowError('Invalid date');
    form.set('teams', 'teamA 01/04 1\r\nteamB 00/20 2');
    expect(() => parseTeams(form)).toThrowError('Invalid date');
    form.set('teams', 'teamA 01/04 1\r\nteamB 0020 2');
    expect(() => parseTeams(form)).toThrowError('Invalid date');
  });
});

const teamA: Team = {
  name: 'teamA',
  regDate: '01/01',
  group: '1',
  gamesPlayed: 0,
};
const teamB: Team = {
  name: 'teamB',
  regDate: '01/01',
  group: '1',
  gamesPlayed: 0,
};
const teamC: Team = {
  name: 'teamC',
  regDate: '01/01',
  group: '1',
  gamesPlayed: 0,
};
const teamD: Team = {
  name: 'teamD',
  regDate: '01/01',
  group: '2',
  gamesPlayed: 0,
};
const teamE: Team = {
  name: 'teamE',
  regDate: '01/01',
  group: '2',
  gamesPlayed: 0,
};
const teamF: Team = {
  name: 'teamE',
  regDate: '01/01',
  group: '2',
  gamesPlayed: 0,
};
describe('parseTeams', () => {
  let teams: Team[] = [];
  beforeEach(() => {
    teams = [];
  });

  test('should return an error message if there are fewer teams in any group than specified', () => {
    teams = [teamA, teamB];

    expect(() => validateTeams(teams, 2)).toThrowError(
      'Group 2 has 0 team(s) instead of 2'
    );
    teams = [teamD, teamE];
    expect(() => validateTeams(teams, 2)).toThrowError(
      'Group 1 has 0 team(s) instead of 2'
    );
  });
  test('should return an error message if there are more teams in any group than specified', () => {
    teams = [teamA, teamB, teamC, teamD, teamE];
    expect(() => validateTeams(teams, 2)).toThrowError(
      'Group 1 has 3 team(s) instead of 2'
    );
    teams = [teamA, teamB, teamD, teamE, teamF];
    expect(() => validateTeams(teams, 2)).toThrowError(
      'Group 2 has 3 team(s) instead of 2'
    );
  });
});

describe('parseAndValidateMatches', () => {
  const form: FormData = new FormData();
  beforeEach(() => {
    form.delete('matches');
    teamA.gamesPlayed = 0;
    teamB.gamesPlayed = 0;
    teamC.gamesPlayed = 0;
    teamD.gamesPlayed = 0;
    teamE.gamesPlayed = 0;
    teamF.gamesPlayed = 0;
  });

  test('should return an error message on blank input', () => {
    form.append('matches', '');
    expect(() => parseAndValidateMatches([], form)).toThrowError(
      'Please fill in the matches played.'
    );
  });

  test('should return an error message if a match consist of a non-existing team', () => {
    form.append('matches', 'teamA teamE 0 0');
    expect(() => parseAndValidateMatches([teamA], form)).toThrowError(
      'Invalid team name, team does not exist'
    );

    form.append('matches', 'teamB teamA 0 0');
    expect(() => parseAndValidateMatches([teamA], form)).toThrowError(
      'Invalid team name, team does not exist'
    );
  });

  test('should return an error message on malformatted goals', () => {
    form.append('matches', 'teamA teamB hello world');
    expect(() => parseAndValidateMatches([teamA, teamB], form)).toThrowError(
      'Invalid input for goals scored.'
    );
  });

  test('should return an error message if a match is between teams of different groups', () => {
    form.append('matches', 'teamA teamD 0 0');

    expect(() => parseAndValidateMatches([teamA, teamD], form)).toThrowError(
      'Teams can only play other teams in the same group.'
    );
  });

  test('should return an error message if more than one match between two teams', () => {
    form.append(
      'matches',
      'teamA teamB 0 0\r\nteamD teamE 0 0\r\nteamB teamA 0 0'
    );

    expect(() =>
      parseAndValidateMatches([teamA, teamB, teamD, teamE], form)
    ).toThrowError('Each team can only play another team once.');
  });

  test('should return an error message if there are wrong number of matches', () => {
    form.append('matches', 'teamA teamB 0 0');
    expect(() =>
      parseAndValidateMatches([teamA, teamB, teamD, teamE], form, 2)
    ).toThrowError('teamD only played 0 out of 1 game(s).');
  });
});
