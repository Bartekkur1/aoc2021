import { readAs } from "../util/readAs";

interface Point {
    x: number;
    y: number;
}

interface Line {
    start: Point;
    end: Point;
}

type Map = Array<number[]>;

const stringToPoint = (input: string): Point => {
    const [x, y] = input.split(',');
    return {
        x: parseInt(x),
        y: parseInt(y)
    };
};

const incrementMap = (point: Point, map: Map) => {
    map[point.x][point.y] += 1;
};

const isLineStraight = (line: Line): boolean => {
    return line.start.x === line.end.x || line.start.y === line.end.y;
};

const drawLine = (line: Line, map: Map, onlyStraight: boolean = false) => {
    if (onlyStraight && !isLineStraight(line)) {
        return;
    }
    const cursor: Point = line.start;
    incrementMap(cursor, map);

    while (cursor.x !== line.end.x || cursor.y !== line.end.y) {

        if (cursor.x < line.end.x) {
            cursor.x += 1;
        }
        if (cursor.x > line.end.x) {
            cursor.x -= 1;
        }

        if (cursor.y > line.end.y) {
            cursor.y -= 1;
        }
        if (cursor.y < line.end.y) {
            cursor.y += 1;
        }
        incrementMap(cursor, map);
    }
};

const findMapSize = (input: Line[]): Point => {
    const xs: number[] = [];
    const ys: number[] = [];
    xs.push(...input.map(line => line.end.x));
    xs.push(...input.map(line => line.start.x));
    ys.push(...input.map(line => line.end.y));
    ys.push(...input.map(line => line.start.y));
    return {
        x: Math.max(...xs) + 1,
        y: Math.max(...ys) + 1
    };
};

const solveLevel5Part1 = (input: Line[]) => {
    const mapSize = findMapSize(input);
    const map: Map = Array.from(Array(mapSize.x), () => new Array(mapSize.y).fill(0));

    for (let line of input) {
        drawLine(line, map, true);
    }
    return map.flatMap(row => row.flatMap(col => col > 1).filter(v => !!v)).length;
};

const solveLevel5Part2 = (input: Line[]) => {
    const mapSize = findMapSize(input);
    const map: Map = Array.from(Array(mapSize.x), () => new Array(mapSize.y).fill(0));

    for (let line of input) {
        drawLine(line, map, false);
    }
    return map.flatMap(row => row.flatMap(col => col > 1).filter(v => !!v)).length;

};

describe('Level 5', () => {
    describe('Part 1', () => {
        it('Solve example input', () => {
            const input = readAs<Line[]>({
                parser: (input) => {
                    return input.map(line => {
                        const [startRaw, endRaw] = line.split(/\s\-\>\s/);
                        return {
                            start: stringToPoint(startRaw),
                            end: stringToPoint(endRaw)
                        };
                    });
                },
                path: './src/level5/exampleinput'
            });

            const overlapCells = solveLevel5Part1(input);
            expect(overlapCells).toBe(5);
        });

        it('Solve input', () => {
            const input = readAs<Line[]>({
                parser: (input) => {
                    return input.map(line => {
                        const [startRaw, endRaw] = line.split(/\s\-\>\s/);
                        return {
                            start: stringToPoint(startRaw),
                            end: stringToPoint(endRaw)
                        };
                    });
                },
                path: './src/level5/input'
            });

            const overlapCells = solveLevel5Part1(input);
            expect(overlapCells).toBe(5632);
        });
    });

    describe('Part 2', () => {
        it('Solve example input', () => {
            const input = readAs<Line[]>({
                parser: (input) => {
                    return input.map(line => {
                        const [startRaw, endRaw] = line.split(/\s\-\>\s/);
                        return {
                            start: stringToPoint(startRaw),
                            end: stringToPoint(endRaw)
                        };
                    });
                },
                path: './src/level5/exampleinput'
            });

            const overlapCells = solveLevel5Part2(input);
            expect(overlapCells).toBe(12);
        })

        it('Solve input', () => {
            const input = readAs<Line[]>({
                parser: (input) => {
                    return input.map(line => {
                        const [startRaw, endRaw] = line.split(/\s\-\>\s/);
                        return {
                            start: stringToPoint(startRaw),
                            end: stringToPoint(endRaw)
                        };
                    });
                },
                path: './src/level5/input'
            });

            const overlapCells = solveLevel5Part2(input);
            expect(overlapCells).toBe(22213);
        });
    });
});