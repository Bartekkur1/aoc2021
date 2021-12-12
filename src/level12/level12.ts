import { readAs } from "../util/readAs";

enum Size {
    BIG,
    SMALL
}

interface Cave {
    name: string;
    neighbors: Cave[];
    size: Size;
}

const caveExists = (name: string, caves: Cave[]) => {
    return caves.some(c => c.name === name);
};

const findCave = (name: string, caves: Cave[]) => {
    return caves.find(c => c.name === name);
};

const getCaveSize = (name: string): Size => {
    return name == name.toUpperCase() ? Size.BIG : Size.SMALL;
};

const input = readAs<Cave[]>({
    parser: (input) => {
        const caves: Cave[] = [];

        input.map(i => {
            const [name, target] = i.split('-');
            if (!caveExists(name, caves)) {
                caves.push({ name, size: getCaveSize(name), neighbors: [] });
            }
            if (!caveExists(target, caves)) {
                caves.push({ name: target, size: getCaveSize(target), neighbors: [] });
            }

        });


        return [];
    },
    path: './src/level12/exampleinput'
});