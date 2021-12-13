import { readAs } from "../util/readAs";

interface Point {
    x: number;
    y: number;
}

type Axis = "x" | "y";

interface Fold {
    axis: Axis;
    value: number;
}

const input = readAs<{ points: Point[], folds: Fold[] }>({
    parser: (input: string[]) => {
        const points: Point[] = [];
        const folds: Fold[] = [];
        input.filter(i => i != '').forEach(i => {

            if (/\d+\,\d+/.test(i)) {
                const [x, y] = i.split(',');
                points.push({ x: parseInt(x), y: parseInt(y) });
            } else {
                const foldInstruction = i.split(/\s/)[2];
                const [axis, value] = foldInstruction.split('=');
                folds.push({
                    axis: (axis as Axis),
                    value: parseInt(value)
                });
            }


        });

        return {
            points, folds
        };
    },
    path: './src/level13/input'
    // path: './src/level13/exampleinput'
});

const getMapSizeFromPoints = (cells: Point[]): Point => {
    const [mapSizeX] = cells.sort((a, b) => b.x - a.x).map(p => p.x);
    const [mapSizeY] = cells.sort((a, b) => b.y - a.y).map(p => p.y);

    return {
        x: mapSizeX,
        y: mapSizeY
    };
};

const getMapSize = (map: Array<boolean[]>): Point => {
    return {
        x: map[0].length,
        y: map.length
    };
};

const printMap = (map: Array<boolean[]>) => {
    map.forEach(row => {
        console.log(row.map(cell => cell ? '#' : '.').join(''));
    });
};

const foldPoint = (cell: Point, fold: Fold): Point => {
    if (fold.axis == 'y') {

        let yDiff = cell.y - fold.value;
        let newY = fold.value - yDiff;
        return {
            x: cell.x,
            y: newY
        };
    } else {
        let xDiff = cell.x - fold.value;
        let newX = fold.value - xDiff;
        return {
            x: newX,
            y: cell.y
        };
    }
};

const mapSize = getMapSizeFromPoints(input.points);
console.log(mapSize);

let map: Array<boolean[]> = Array.from(Array(mapSize.y + 1), () => Array(mapSize.x + 1).fill(false));

const setMapPoint = (p: Point) => {
    map[p.y][p.x] = true;
};

for (let point of input.points) {
    setMapPoint(point);
}

const foldMap = (map: Array<boolean[]>, fold: Fold) => {
    const mapSize = getMapSize(map);
    console.log(mapSize);


    if (fold.axis == 'y') {

        let foldedMap: Array<boolean[]> = Array.from(Array((mapSize.y - 1) / 2), () => Array((mapSize.x)).fill(false));
        for (let y = 0; y < fold.value; y++) {
            foldedMap[y] = map[y];
        }

        for (let y = fold.value; y < mapSize.y; y++) {
            for (let x = 0; x < mapSize.x; x++) {
                if (map[y][x]) {
                    const foldPointPos = foldPoint({ x, y }, fold);
                    foldedMap[foldPointPos.y][foldPointPos.x] = true;
                }
            }
        }
        return foldedMap;
    } else {

        let foldedMap: Array<boolean[]> = Array.from(Array(mapSize.y), () => Array(((mapSize.x - 1) / 2)).fill(false));

        for (let y = 0; y < mapSize.y; y++) {
            for (let x = 0; x < fold.value; x++) {
                if (map[y][x]) {
                    foldedMap[y][x] = true;
                }
            }
        }

        for (let y = 0; y < mapSize.y; y++) {
            for (let x = fold.value; x <= mapSize.x; x++) {
                if (map[y][x]) {
                    const foldPointPos = foldPoint({ x, y }, fold);
                    foldedMap[foldPointPos.y][foldPointPos.x] = true;
                }
            }
        }
        return foldedMap;
    }
}

for (let fold of input.folds) {
    map = foldMap(map, fold);
}

printMap(map);


const truers = map.flatMap(row => row.filter(r => r === true));
console.log(truers.length);
