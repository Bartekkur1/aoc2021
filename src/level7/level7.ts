import { readAs } from "../util/readAs";

const input = readAs<number[]>({
  parser: (input) => {
    return input[0].split(',').map(i => parseInt(i))
  },
  path: './src/level7/input'
});

const calculateFuelNeededToMove = (pos: number, target: number) => {
  return Math.abs(pos - target);
};

const calculateFuelNeededToMoveSum = (pos: number, target: number) => {
  const max = Math.abs(pos - target);
  return Math.abs((max / 2) * (1 + max));
};

type FuelFunction = (pos: number, target: number) => number;

const solveLevel7 = (input: number[], calcFuel: FuelFunction) => {
  const maxPosition = Math.max(...input);
  let fuelList: number[] = [];

  for (let target = 1; target <= maxPosition; target++) {
    let fuel = 0;
    for (let pos of input) {
      fuel += calcFuel(pos, target);
    }
    fuelList[target] = fuel;
  }

  fuelList.shift();
  return Math.min(...fuelList);
};

console.log(solveLevel7(input, calculateFuelNeededToMove));
console.log(solveLevel7(input, calculateFuelNeededToMoveSum));