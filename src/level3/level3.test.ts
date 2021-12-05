import { readAs } from "../util/readAs";

interface DiagnosticReport {
  gammaRate: number;
  epsilonRate: number;
  powerConsumption: number;
};

interface LifeSupportRating {
  oxygenGeneratorRating: number;
  co2scrubberRating: number;
};

const countBin = (input: string[]) => {
  const binCounts: number[] = [];
  input.forEach((diagnoseCode) => {
    diagnoseCode.split("").forEach((bin, i) => {
      if (!binCounts[i]) binCounts[i] = 0;
      if (bin === "1") {
        binCounts[i]++;
      } else {
        binCounts[i]--;
      }
    });
  });
  return binCounts;
};

const solveLevel3Part1 = (input: string[]): DiagnosticReport => {
  const binCounts: number[] = countBin(input);

  let gammaBinary = "";
  let epsilonBinary = "";
  for (let binCount of binCounts) {
    if (binCount > 0) {
      gammaBinary += "1";
      epsilonBinary += "0";
    } else {
      gammaBinary += "0";
      epsilonBinary += "1";
    }
  }

  const epsilonRate = parseInt(epsilonBinary, 2);
  const gammaRate = parseInt(gammaBinary, 2);

  return {
    epsilonRate,
    gammaRate,
    powerConsumption: epsilonRate * gammaRate
  };
};

const filterBits = (input: string[], codeCompare: (code: string, mostCommonBit: string, i: number) => boolean) => {
  let filteredInput = input;
  let binCounts: number[] = countBin(input);
  for (let i = 0; i <= input[0].length - 1; i++) {
    const mostCommonBit = binCounts[i] >= 0 ? "1" : "0";
    filteredInput = filteredInput.filter(code => codeCompare(code, mostCommonBit, i));
    if (filteredInput.length === 1) {
      break;
    }
    binCounts = countBin(filteredInput);
  }
  return parseInt(filteredInput[0], 2);
};

const solveLevel3Part2 = (input: string[]): LifeSupportRating => {
  const lifeSupportRating: LifeSupportRating = {
    co2scrubberRating: filterBits(input, (code, mostCommonBit, i) => code.split("")[i] !== mostCommonBit),
    oxygenGeneratorRating: filterBits(input, (code, mostCommonBit, i) => code.split("")[i] === mostCommonBit)
  };

  return lifeSupportRating;
};

describe('Level 3', () => {

  describe('Part 1', () => {

    it('Solve example input', () => {
      const input = [
        "00100",
        "11110",
        "10110",
        "10111",
        "10101",
        "01111",
        "00111",
        "11100",
        "10000",
        "11001",
        "00010",
        "01010"
      ];
      const { epsilonRate, gammaRate, powerConsumption } = solveLevel3Part1(input);

      expect(gammaRate).toBe(22);
      expect(epsilonRate).toBe(9);
      expect(powerConsumption).toBe(198);
    });

    it('Solve input', () => {
      const input = readAs<string[]>({
        parser: (input) => input,
        path: './src/level3/input',
        splitter: /\n|\r/
      });
      const { epsilonRate, gammaRate, powerConsumption } = solveLevel3Part1(input);

      console.log(epsilonRate, gammaRate, powerConsumption);


      expect(gammaRate).toBe(3827);
      expect(epsilonRate).toBe(268);
      expect(powerConsumption).toBe(1025636);
    });

  });

  describe('Part 2', () => {
    it('Solve example input', () => {
      const input = [
        "00100",
        "11110",
        "10110",
        "10111",
        "10101",
        "01111",
        "00111",
        "11100",
        "10000",
        "11001",
        "00010",
        "01010"
      ];

      const { co2scrubberRating, oxygenGeneratorRating } = solveLevel3Part2(input);
      expect(co2scrubberRating).toBe(10);
      expect(oxygenGeneratorRating).toBe(23);
    });

    it('Solve input', () => {
      const input = readAs<string[]>({
        parser: (input) => input,
        path: './src/level3/input',
        splitter: /\n|\r/
      });
      const { co2scrubberRating, oxygenGeneratorRating } = solveLevel3Part2(input);
      console.log(co2scrubberRating * oxygenGeneratorRating);
      expect(co2scrubberRating).toBe(257);
      expect(oxygenGeneratorRating).toBe(3089);
    });
  });

});