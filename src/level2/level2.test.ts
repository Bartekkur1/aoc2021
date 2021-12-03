import { readAs } from "../util/readAs";

enum Direction {
  FORWARD = "forward",
  DOWN = "down",
  UP = "up"
};

interface Command {
  direction: Direction;
  steps: number;
}

interface Position {
  depth: number;
  horizontal: number;
}

interface AimPosition extends Position {
  aim: number;
}

const createPosition = (): Position => ({ depth: 0, horizontal: 0 });
const createAimPosition = (): AimPosition => ({ ...createPosition(), aim: 0 });

const executeCommand = (command: Command, position: Position) => {
  const { direction, steps } = command;
  if (direction === Direction.FORWARD) position.horizontal += steps;
  if (direction === Direction.DOWN) position.depth -= steps;
  if (direction === Direction.UP) position.depth += steps;
  return position;
};

const executeCommand2 = (command: Command, position: AimPosition) => {
  const { direction, steps } = command;
  if (direction === Direction.FORWARD) {
    position.horizontal += steps;
    position.depth += (position.aim * steps);
  }
  if (direction === Direction.DOWN) position.aim += steps;
  if (direction === Direction.UP) position.aim -= steps;
  return position;
};

const solveLevel2part1 = (commands: Command[]): number => Math.abs(Object.values(commands.reduce((position, command) => executeCommand(command, position), createPosition())).reduce((a, b) => a * b));
const solveLevel2part2 = (commands: Command[]): number => Math.abs(Object.values(commands.reduce((position, command) => executeCommand2(command, position), createAimPosition())).slice(0, 2).reduce((a, b) => a * b));

describe('Level 2', () => {

  const readInput = () => {
    return readAs<Command[]>({
      parser: (input: string[]) => input.map(rawCommand => {
        const splittedCommand = rawCommand.split(/\s/);
        return {
          direction: splittedCommand[0] as Direction,
          steps: parseInt(splittedCommand[1])
        }
      }),
      path: './src/level2/input'
    });
  };

  describe('Part 1', () => {

    it('Solve example input', () => {
      const input: Command[] = [
        { direction: Direction.FORWARD, steps: 5 },
        { direction: Direction.DOWN, steps: 5 },
        { direction: Direction.FORWARD, steps: 8 },
        { direction: Direction.UP, steps: 3 },
        { direction: Direction.DOWN, steps: 8 },
        { direction: Direction.FORWARD, steps: 2 }
      ];

      const result = solveLevel2part1(input);
      expect(result).toBe(150);
    });

    it('Solve input', () => {
      const input = readInput();
      const result = solveLevel2part1(input);
      expect(result).toBe(1990000);
    });

  });

  describe('Part 2', () => {

    it('Solve example data', () => {
      const input: Command[] = [
        { direction: Direction.FORWARD, steps: 5 },
        { direction: Direction.DOWN, steps: 5 },
        { direction: Direction.FORWARD, steps: 8 },
        { direction: Direction.UP, steps: 3 },
        { direction: Direction.DOWN, steps: 8 },
        { direction: Direction.FORWARD, steps: 2 }
      ];

      const result = solveLevel2part2(input);
      expect(result).toBe(900);
    });

    it('Solve input', () => {
      const input = readInput();
      console.log(input);

      const result = solveLevel2part2(input);
      expect(result).toBe(1975421260);
    });

  });

});