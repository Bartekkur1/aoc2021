import { readAs } from "../util/readAs";

interface Position {
    x: number;
    y: number;
}

interface Octopus {
    value: number;
    position: Position;
    flashes: number;
    flashedInStep: boolean;
    neighbors: Octopus[];
};

const size = 10;

const input = readAs<Array<number[]>>({
    parser: (input) => {
        const inputMatrix = input.map(l => l.split(''));

        const arr = Array.from(new Array(size), () => Array(size).fill(0));
        for (let x = 0; x <= size - 1; x++) {
            for (let y = 0; y <= size - 1; y++) {
                arr[x][y] = parseInt(inputMatrix[x][y]);
            }
        }
        return arr;
    },
    path: './src/level11/input'
    // path: './src/level11/exampleinput'
});

const parseInput = (input: Array<number[]>): Octopus[] => {
    const res: Octopus[] = [];

    for (let x = 0; x < input.length; x++) {
        for (let y = 0; y < input[0].length; y++) {
            res.push({
                flashes: 0,
                value: input[x][y],
                position: { x, y },
                neighbors: [],
                flashedInStep: false
            });
        }
    }
    return res;
};

const findOctopusByPosition = (position: Position, octopuses: Octopus[]): Octopus | undefined => {
    return octopuses.find(o => o.position.x == position.x && o.position.y == position.y);
};

const octopusExists = (position: Position, octopuses: Octopus[]) => {
    return octopuses.find(o => o.position.x == position.x && o.position.y == position.y) != undefined;
};

const generateNeighborsPosition = (position: Position): Position[] => {
    return [
        { x: position.x, y: position.y + 1 },
        { x: position.x + 1, y: position.y + 1 },
        { x: position.x + 1, y: position.y },
        { x: position.x + 1, y: position.y - 1 },
        { x: position.x, y: position.y - 1 },
        { x: position.x - 1, y: position.y - 1 },
        { x: position.x - 1, y: position.y },
        { x: position.x - 1, y: position.y + 1 },
    ];
}

const findOctopusNeighbors = (octopus: Octopus, octopuses: Octopus[]) => {
    const { position } = octopus;

    const positions = generateNeighborsPosition(position);

    for (let position of positions) {
        if (octopusExists(position, octopuses)) {
            const neighbor = findOctopusByPosition(position, octopuses);
            if (!neighbor) continue;
            octopus.neighbors?.push(neighbor);
        }
    }
};

const assignOctopusNeighbors = (octopuses: Octopus[]) => {
    for (let octopus of octopuses) {
        findOctopusNeighbors(octopus, octopuses);
    }
};

const octopuses: Octopus[] = parseInput(input);
assignOctopusNeighbors(octopuses);

const processOctopus = (octopus: Octopus) => {
    if (octopus.value > 0 || !octopus.flashedInStep) {
        octopus.value += 1;
    }
    if (octopus.value > 9) {
        octopus.value = 0;
        octopus.flashes += 1;
        octopus.flashedInStep = true;
        for (let neighbor of octopus.neighbors) {
            processOctopus(neighbor);
        }
    }
};

// part 1
const steps = 100;
for (let step = 0; step < steps; step++) {
    for (let octopus of octopuses) {
        processOctopus(octopus);
    }
    if (octopuses.find(o => o.flashedInStep == false) === undefined) {
        console.log(step);
    }
    octopuses.forEach(o => o.flashedInStep = false);
}

// part 2
// let step = 1;
// while (octopuses.find(o => o.flashedInStep == false) !== undefined) {
//     octopuses.forEach(o => o.flashedInStep = false);
//     for (let octopus of octopuses) {
//         processOctopus(octopus);
//     }
//     if (octopuses.find(o => o.flashedInStep == false) === undefined) {
//         console.log(step);
//     }
//     step += 1;
// }


console.log(octopuses.reduce((prev, curr, i) => {
    let addition = `${curr.value}`;
    if ((i + 1) % 10 == 0) {
        addition += '\n'
    };
    return prev += addition;
}, ""));

console.log(octopuses.reduce((prev, curr) => prev += curr.flashes, 0));