import { readAs } from "../util/readAs";

const solvePart1 = (input: number[]) => input.reduce((prev, next, index) => next < input[index + 1] ? prev += 1 : prev, 0);
const solvePart2 = (input: number[]) => solvePart1(input.map((_, i) => input[i] + input[i + 1] + input[i + 2]).filter(v => v != NaN));

describe('Level 1', () => {

  describe('Part 1', () => {
    const input = readAs<number[]>({
      parser: (input: string[]) => input.map(i => parseInt(i)),
      path: './src/level1/input'
    });

    it('Solve example input', () => {
      const input = [
        199,
        200,
        208,
        210,
        200,
        207,
        240,
        269,
        260,
        263
      ];

      const result = solvePart1(input);
      expect(result).toBe(7);
    });

    it('Solve input', () => {
      const result = solvePart1(input);
      expect(result).toBe(1342);
    });
  });

  describe('Part 2', () => {
    const input = readAs<number[]>({
      parser: (input: string[]) => input.map(i => parseInt(i)),
      path: './src/level1/input'
    });

    it('Solve example input', () => {

      const input = [
        199,
        200,
        208,
        210,
        200,
        207,
        240,
        269,
        260,
        263,
      ];

      const result = solvePart2(input);
      expect(result).toBe(5);
    });

    it('Solve input', () => {
      const result = solvePart2(input);
      expect(result).toBe(1378);
    });
  });

});