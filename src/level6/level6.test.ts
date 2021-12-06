import { readAs } from "../util/readAs";

const handleZeros = (state: number[]): number[] => {
  const newFish: number[] = [];

  const newState = state.map(s => {
    if (s === -1) {
      newFish.push(8);
      return 6
    };

    return s;
  });

  newState.push(...newFish);
  return newState;
};

const iterateDays = (days: number, initialState: number[]) => {
  for (let day = 1; day <= days; day++) {
    initialState = initialState.map(s => s -= 1);
    initialState = handleZeros(initialState);
  }

  return initialState;
};

const solveLevel6Part1 = (days: number, initialState: number[]) => {
  const fishGroup = iterateDays(days, initialState);
  return fishGroup.length;
};

type FishCache = { [key: number]: number };

interface Fish {
  value: number;
  day: number;
}

const cache: FishCache = {};

const countFishFishes = (fish: Fish, days: number) => {
  let val = fish.value;
  let count = 0;
  for (let i = fish.day; i <= days; i++) {
    if (val <= -1) {
      val = 6;
      count++;
    }
    val -= 1;
  }
  return count;
};

let result = 0;

const spawnFishFishes = (fish: Fish, days: number) => {
  const fishesCount = countFishFishes(fish, days);

  if (fishesCount === 0) {
    return;
  }

  const spawnedFishes: Fish[] = [];
  for (let i = 0; i < fishesCount; i++) {
    const day = (i * 6) + fish.value + i + 1 + fish.day;
    spawnedFishes.push({ day, value: 8 });
  }

  result += spawnedFishes.length;
  for (let fish of spawnedFishes) {
    spawnFishFishes(fish, days);
  }
};

const solveLevel6Part2 = (fishes: Fish[], days: number) => {
  for (let fish of fishes) {
    if (cache[fish.value]) {
      result += cache[fish.value];
    } else {
      const beforeCount = result;
      result++;
      spawnFishFishes(fish, days);
      const afterCount = result;
      const increasePopulation = afterCount - beforeCount;
      cache[fish.value] = increasePopulation;
    }
  }
};

describe('Level 6', () => {

  describe('Part 1', () => {
    it('Solve example input', () => {
      const initialState = [3, 4, 3, 1, 2];
      expect(solveLevel6Part1(18, initialState)).toBe(26);
      expect(solveLevel6Part1(80, initialState)).toBe(5934);
    });

    it('Solve input', () => {
      const input = readAs<number[]>({
        parser: (input) => {
          return input[0].split(',').map(v => parseInt(v));
        },
        path: './src/level6/input'
      });
      expect(solveLevel6Part1(80, input)).toBe(360610);
    });
  });

  describe('Part 2', () => {
    it('Solve input', () => {
      const input = readAs<number[]>({
        parser: (input) => {
          return input[0].split(',').map(v => parseInt(v));
        },
        path: './src/level6/input'
      });
      let fishes: Fish[] = input.map(fv => ({
        day: 0,
        value: fv
      }));
      // karasie jedzom gówno
      expect(solveLevel6Part2(fishes, 256)).toBe(1_631_629_590_423);
    });
  });


});