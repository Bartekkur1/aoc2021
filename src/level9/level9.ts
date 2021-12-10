import { readAs } from "../util/readAs";

interface Position {
  x: number;
  y: number;
};

interface PointAdjacent {
  top: RiskPoint;
  bottom: RiskPoint;
  left: RiskPoint;
  right: RiskPoint;
}

interface Adjacent {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface RiskPoint {
  position: Position;
  pointAdjacent?: PointAdjacent;
  value: number;
  group?: number;
};

const getPoint = (position: Position, map: RiskPoint[]): RiskPoint => {
  return map.find(p => p.position.x === position.x && p.position.y === position.y) || {
    position, value: 10, group: 0
  };
};

const getNeighborGroups = (position: Position, map: RiskPoint[]): Adjacent => {
  const { x, y } = position;
  const topPos = y + 1;
  const bottomPos = y - 1;
  const leftPos = x - 1;
  const rightPos = x + 1;

  return {
    top: getPoint({ x, y: bottomPos }, map).group || 0,
    bottom: getPoint({ x, y: topPos }, map).group || 0,
    right: getPoint({ x: rightPos, y }, map).group || 0,
    left: getPoint({ x: leftPos, y }, map).group || 0
  };
};

const assignPointAdjacent = (point: RiskPoint, map: RiskPoint[]): void => {
  const { x, y } = point.position;
  const topPos = y + 1;
  const bottomPos = y - 1;
  const leftPos = x - 1;
  const rightPos = x + 1;

  point.pointAdjacent = {
    top: getPoint({ x, y: bottomPos }, map),
    bottom: getPoint({ x, y: topPos }, map),
    right: getPoint({ x: rightPos, y }, map),
    left: getPoint({ x: leftPos, y }, map)
  };
};

const isPointLowRisk = (point: RiskPoint): boolean => {
  const { value, pointAdjacent } = point;
  if (!pointAdjacent) return false;
  const { bottom, top, left, right } = pointAdjacent;
  return value < bottom.value && value < top.value && value < left.value && value < right.value;
};

const findLowRiskPoints = (points: RiskPoint[]): RiskPoint[] => {
  return points.filter(p => isPointLowRisk(p));
};

const readInput = (path: string) => {
  return readAs<RiskPoint[]>({
    parser: (input) => {
      const rawPoints = input.filter(i => i != '').map(i => i.split('')).map(row => row.map(col => parseInt(col)));
      const size = rawPoints[0].length;

      const result: RiskPoint[] = [];
      for (let y = 0; y <= rawPoints.length - 1; y++) {
        for (let x = 0; x <= size - 1; x++) {
          result.push({
            position: { x, y },
            value: rawPoints[y][x],
            group: 0
          });
        }
      }

      return result;
    },
    path,
    splitter: /\n|\r/g
  });
}

const assignAdjacentPoints = (points: RiskPoint[]) => {
  for (let point of points) {
    assignPointAdjacent(point, points);
  }
};

const input = readInput("./src/level9/input");
// const input = readInput("./src/level9/exampleinput");

assignAdjacentPoints(input);
console.log(`Part 1 solution: ${findLowRiskPoints(input).reduce((prev, curr) => prev += curr.value + 1, 0)}`);

let group = 1;

const followDownhill = (point: RiskPoint, group: number) => {
  if (point.value === 9 || point.value === 10 || point.group !== 0) return;

  point.group = group;

  if (point.pointAdjacent) {
    followDownhill(point.pointAdjacent.top, group);
    followDownhill(point.pointAdjacent.bottom, group);
    followDownhill(point.pointAdjacent.left, group);
    followDownhill(point.pointAdjacent.right, group);
  }
};

assignAdjacentPoints(input);
for (let point of input) {
  followDownhill(point, group);
  group += 1;
}

let groupCount: number[] = [];
input.map(i => i.group).forEach(n => {
  if (n === undefined || n === 0) return;
  if (groupCount[n] === undefined) {
    groupCount[n] = 0;
  }
  groupCount[n] += 1;
});
const [a, b, c] = groupCount.filter(c => c != NaN).sort((a, b) => b - a).slice(0, 3);
console.log(a * b * c);
