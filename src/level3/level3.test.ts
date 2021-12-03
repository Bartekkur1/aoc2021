import { readAs } from "../util/readAs";

interface DiagnosticReport {
  gammaRate: number;
  epsilonRate: number;
};

const createDiagnosticReport = (): DiagnosticReport => ({
  epsilonRate: 0,
  gammaRate: 0
});

const countOccurrences = (report: DiagnosticReport, count: number, index: number) => {
  if (count > 0) {
    report.gammaRate += Math.pow(2, index);
  } else {
    report.epsilonRate += Math.pow(2, index);
  }

  return report;
};

const solveLevel3 = (input: string[]): DiagnosticReport => input.reduce((count, diagnoseCode) => diagnoseCode.split("").reduce((count, bin, index) => count.map((c, cIndex) => index === cIndex ? (c += (bin === '1' ? 1 : -1)) : c), count), new Array(input[0].length).fill(0)).reverse().reduce(countOccurrences, createDiagnosticReport());

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
      const { epsilonRate, gammaRate } = solveLevel3(input);
      const powerConsumption = epsilonRate * gammaRate;
      expect(powerConsumption).toBe(198);

      expect(gammaRate).toBe(22);
      expect(epsilonRate).toBe(9);
      expect(powerConsumption).toBe(198);
    });


  });


});