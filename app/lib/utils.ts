import { MatchPointsAssignment, Table, Team } from './declaration';

export const points: MatchPointsAssignment = {
  normal: {
    win: 3,
    draw: 1,
    loss: 0,
  },
  alternate: {
    win: 5,
    draw: 2,
    loss: 1,
  },
};

export function totalMatchPoints(team: Team) {
  return (
    team.wins * points.normal.win +
    team.draws * points.normal.draw +
    team.losses * points.normal.loss
  );
}

export function totalAlternateMatchPoints(team: Team) {
  return (
    team.wins * points.alternate.win +
    team.draws * points.alternate.draw +
    team.losses * points.alternate.loss
  );
}

export function sortTable(table: Table) {
  table.sort((a: Team, b: Team) => {
    const pointsDiff = totalMatchPoints(b) - totalMatchPoints(a);
    if (pointsDiff != 0) return pointsDiff;

    const goalDiff = b.goals - a.goals;
    if (goalDiff != 0) return goalDiff;

    const altPointsDiff =
      totalAlternateMatchPoints(b) - totalAlternateMatchPoints(a);
    if (altPointsDiff != 0) return altPointsDiff;
    return a.regDate.valueOf() - b.regDate.valueOf();
  });
  return table;
}
