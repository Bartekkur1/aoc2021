import { readAs } from "../util/readAs";

interface Position {
  x: number;
  y: number;
};

interface PointAdjacent {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface RiskPoint {
  position: Position;
  pointAdjacent: PointAdjacent;
  value: number;
};

const getPoint = (position: Position, map: Array<number[]>): number => {
  if (map[position.y] !== undefined && map[position.y][position.x] !== undefined) {
    return map[position.y][position.x];
  } else {
    return 10;
  }
};

const findPointAdjacent = (position: Position, map: Array<number[]>): PointAdjacent => {
  const { x, y } = position;
  const topPos = y + 1;
  const bottomPos = y - 1;
  const leftPos = x - 1;
  const rightPos = x + 1;

  const top = getPoint({ x, y: bottomPos }, map);
  const bottom = getPoint({ x, y: topPos }, map);
  const right = getPoint({ x: rightPos, y }, map);
  const left = getPoint({ x: leftPos, y }, map);

  return {
    top,
    bottom,
    right,
    left
  };
};

const isPointLowRisk = (point: RiskPoint): boolean => {
  const { value, pointAdjacent } = point;
  const { bottom, top, left, right } = pointAdjacent;
  return value < bottom && value < top && value < left && value < right;
};

const findLowRisk = (points: RiskPoint[]): RiskPoint[] => {
  return points.filter(p => isPointLowRisk(p));
};

const findLowRiskPoints = (path: string): RiskPoint[] => {
  const points = readAs<RiskPoint[]>({
    parser: (input) => {
      const rawPoints = input.filter(i => i != '').map(i => i.split('')).map(row => row.map(col => parseInt(col)));
      const size = rawPoints[0].length;

      const result: RiskPoint[] = [];
      for (let y = 0; y <= rawPoints.length - 1; y++) {
        for (let x = 0; x <= size - 1; x++) {
          result.push({
            position: { x, y },
            value: rawPoints[y][x],
            pointAdjacent: findPointAdjacent({ y, x }, rawPoints)
          });
        }
      }

      return result;
    },
    path,
    splitter: /\n|\r/g
  });

  return findLowRisk(points);
};

const filterBasins = (points: RiskPoint[]): RiskPoint[] => {
  return points.filter(point => {
    const { value, pointAdjacent } = point;
    const { bottom, top, left, right } = pointAdjacent;
    return value != 9 && (value < top || value < bottom || value < left || value < right);
  });
};

let rawPoints: Array<number[]> = [];

const findBasins = (path: string): RiskPoint[] => {
  const points = readAs<RiskPoint[]>({
    parser: (input) => {
      rawPoints = input.filter(i => i != '').map(i => i.split('')).map(row => row.map(col => parseInt(col)));
      const size = rawPoints[0].length;

      const result: RiskPoint[] = [];
      for (let y = 0; y <= rawPoints.length - 1; y++) {
        for (let x = 0; x <= size - 1; x++) {
          result.push({
            position: { x, y },
            value: rawPoints[y][x],
            pointAdjacent: findPointAdjacent({ y, x }, rawPoints)
          });
        }
      }

      return result;
    },
    path,
    splitter: /\n|\r/g
  });

  return filterBasins(points);
};

// const basins = findBasins("./src/level9/exampleinput");
const basins = findBasins("./src/level9/input");
// console.log(lowRiskPointsExample);

// console.log(lowRiskPointsExample.map(p => `${p.position.x}, ${p.position.y}, value: ${p.value}`));
// console.log(lowRiskPointsExample.length);

const maxX = Math.max(...basins.map(b => b.position.x)) + 1;
const maxY = Math.max(...basins.map(b => b.position.y)) + 1;

// const markMap = Array.from(Array(maxY), () => new Array(maxX).fill(false));
const groupMap = Array.from(Array(maxY), () => new Array(maxX).fill(0));


const getNeighborGroup = (position: Position) => {
  if (groupMap[position.y] !== undefined && groupMap[position.y][position.x] !== undefined) {
    return groupMap[position.y][position.x];
  } else {
    return undefined;
  }
};

let group = 0;

const getNeighborsGroup = (basin: RiskPoint) => {
  const { position, value } = basin;

  const { x, y } = position;
  const topPos = y + 1;
  const bottomPos = y - 1;
  const leftPos = x - 1;
  const rightPos = x + 1;

  const top = getNeighborGroup({ x, y: bottomPos });
  const bottom = getNeighborGroup({ x, y: topPos });
  const right = getNeighborGroup({ x: rightPos, y });
  const left = getNeighborGroup({ x: leftPos, y });

  const rightCorner = getNeighborGroup({ x: rightPos, y: bottomPos });

  if (top && top != 0) return top;
  if (bottom && bottom != 0) return bottom;
  if (left && left != 0) return left;
  if (right && right != 0) return right;

  if (rightCorner && rightCorner != 0) {
    const cornerValue = getPoint({ x: rightPos, y: bottomPos }, rawPoints);
    if (value <= cornerValue) {
      return rightCorner;
    }
  };

  group += 1;
  return group;
};

for (let basin of basins) {
  const { position } = basin;
  groupMap[position.y][position.x] = getNeighborsGroup(basin);
};

console.log(groupMap);


const groupCount: number[] = Array(9).fill(0);

console.log(groupMap.flatMap(g => g));


for (let group of groupMap.flatMap(g => g)) {
  if (group === 0) continue;
  groupCount[group]++
}

const sortedGroupCount = groupCount.sort((a, b) => b - a).slice(0, 3);
const [a, b, c] = sortedGroupCount;
console.log(a * b * c);


// console.log(groupMap);
