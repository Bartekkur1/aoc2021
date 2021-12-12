import { readAs } from "../util/readAs";

enum Size {
    BIG,
    SMALL
};

interface Cave {
    name: string;
    neighbors: Cave[];
    size: Size;
};

const caveExists = (name: string, caves: Cave[]) => {
    return caves.some(c => c.name === name);
};

const findCave = (name: string, caves: Cave[]): Cave => {
    const index = caves.findIndex(c => c.name === name);
    return caves[index];
};

const getCaveSize = (name: string): Size => {
    return name == name.toUpperCase() ? Size.BIG : Size.SMALL;
};

const input = readAs<Cave[]>({
    parser: (input) => {
        const caves: Cave[] = [];

        input.forEach(i => {
            const [name, target] = i.replace(/\r/, '').split('-');
            if (!caveExists(name, caves)) {
                caves.push({ name, size: getCaveSize(name), neighbors: [] });
            }
            if (!caveExists(target, caves)) {
                caves.push({ name: target, size: getCaveSize(target), neighbors: [] });
            }
            findCave(name, caves)!.neighbors.push(findCave(target, caves));
            findCave(target, caves)!.neighbors.push(findCave(name, caves));
        });

        return caves;
    },
    splitter: /\n/,
    path: './src/level12/input'
});

const result: Array<string[]> = [];
const followCave = (cave: Cave, path: string[]) => {
    path.push(cave.name);
    const neighbors = cave.neighbors.filter(n => getCaveSize(n.name) == Size.BIG || !path.includes(n.name));
    for (let neighbor of neighbors) {
        followCave(neighbor, [...path]);
    }
    result.push(path);
};

const start: Cave | undefined = input.find(c => c.name === 'start');
if (start) {
    followCave(start, []);
}

const filteredCaves = result.map(r => {
    if (!r.includes('start') || !r.includes('end')) return [];
    const startIndex = r.findIndex(r => r === 'start');
    const endIndex = r.findIndex(r => r === 'end');
    if (startIndex === -1 || endIndex === -1) return [];
    return r.slice(startIndex, endIndex + 1);
}).filter(e => e.length > 0).reduce((prev, curr) => {
    if (!prev.includes(curr.join())) {
        prev.push(curr.join());
    }
    return prev;
}, []);

// console.log(filteredCaves);
console.log(filteredCaves.length);

