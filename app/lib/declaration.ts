export type Team = {
  name: string;
  regDate: Date;
  wins: number;
  draws: number;
  losses: number;
  goals: number;
  group: 1 | 2;
};

export type Table = Team[];

export type PointsAssignment = {
  win: number;
  draw: number;
  loss: number;
};

export type MatchPointsAssignment = {
  normal: PointsAssignment;
  alternate: PointsAssignment;
};
