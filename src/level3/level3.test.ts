import { readAs } from "../util/readAs";

interface DiagnosticReport {
  gammaRate: number;
  epsilonRate: number;
  powerConsumption: number;
};

interface BinaryCount {
  zeros: number;
  ones: number;
};

const solveLevel3 = (input: string[]): DiagnosticReport => {
  const binCounts: BinaryCount[] = [];
  input.forEach((diagnoseCode) => {
    diagnoseCode.split("").forEach((bin, i) => {
      if (!binCounts[i]) binCounts[i] = { zeros: 0, ones: 0 };
      if (bin === "1") {
        binCounts[i].ones++;
      } else {
        binCounts[i].zeros++;
      }
    });
  });

  let gammaBinary = "";
  let epsilonBinary = "";
  for (let binCount of binCounts) {
    if (binCount.ones > binCount.zeros) {
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
      const { epsilonRate, gammaRate, powerConsumption } = solveLevel3(input);

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
      const { epsilonRate, gammaRate, powerConsumption } = solveLevel3(input);

      console.log(epsilonRate, gammaRate, powerConsumption);


      expect(gammaRate).toBe(3827);
      expect(epsilonRate).toBe(268);
      expect(powerConsumption).toBe(1025636);
    });

  });


});