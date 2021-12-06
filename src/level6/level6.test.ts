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



});