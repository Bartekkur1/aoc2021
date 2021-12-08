import { readAs } from "../util/readAs";

const exampleInput = readAs<string[]>({
  parser: (input) => {
    return input.flatMap(i => i.split(' | ')[1].replace(/\r/, '').split(/\s/));
  },
  path: './src/level8/exampleinput'
});

interface InputData {
  pattern: string[];
  input: string[];
};

const exampleInputPart2 = readAs<InputData[]>({
  parser: (input) => {
    return input.flatMap(i => {
      const k = i.split(' | ');

      return {
        input: k[1].replace(/\r/, '').split(/\s/),
        pattern: k[0].replace(/\r/, '').split(/\s/)
      };
    });
  },
  path: './src/level8/exampleinput'
});

const input = readAs<string[]>({
  parser: (input) => {
    return input.flatMap(i => i.split(' | ')[1].replace(/\r/, '').split(/\s/));
  },
  path: './src/level8/input'
});

const inputPart2 = readAs<InputData[]>({
  parser: (input) => {
    return input.flatMap(i => {
      const k = i.split(' | ');

      return {
        input: k[1].replace(/\r/, '').split(/\s/),
        pattern: k[0].replace(/\r/, '').split(/\s/)
      };
    });
  },
  path: './src/level8/input'
});

interface ClockMap {
  top?: string;
  topLeft?: string;
  topRight?: string;
  middle?: string;
  bottomLeft?: string;
  bottomRight?: string;
  bottom?: string;
}

const getMapChars = (map: ClockMap) => {
  return Object.keys(map).map(k => map[k as keyof ClockMap] || "").join('');
};

const markOnMap = (map: ClockMap, input?: string) => {
  if (!input) return;

  let chars = input.split('').filter(c => !getMapChars(map).includes(c));
  if (input.length == 2) {
    map.topRight = chars[0];
    map.bottomRight = chars[1];
  } else if (input.length == 3) {
    map.top = chars[0];
  } else if (input.length == 4) {
    map.topLeft = chars[0];
    map.middle = chars[1];
  } else if (input.length == 6) {
    map.bottom = chars[0];
  }
};

const compareSignals = (code: string, principal: string, marginOfError: number) => {
  const codeSignals = code.split('').filter(s => s != ',');
  const principalSignals = principal.split('').filter(s => s != ',');

  let errors = 0;
  for (let signal of principalSignals) {
    if (!codeSignals.includes(signal)) {
      errors++;
    }
  }
  if (errors > marginOfError) {
    return false;
  }
  return true;
};

const compareSignals2 = (code: string, principal: string) => {
  if (code.length !== principal.length) return false;

  const codeSignals = code.split('').filter(s => s != ',');
  const principalSignals = principal.split('').filter(s => s != ',');

  for (let signal of principalSignals) {
    if (!codeSignals.includes(signal)) {
      return false;
    }
  }
  return true;
};

const getMapNumberAsString = (map: ClockMap, num: number): string => {
  if (num == 2) return [map.top, map.topRight, map.middle, map.bottomLeft, map.bottom].join('');
  if (num == 3) return [map.top, map.topRight, map.middle, map.bottomRight, map.bottom].join('');
  if (num == 5) return [map.top, map.topLeft, map.middle, map.bottomRight, map.bottom].join('');
  if (num == 6) return [map.top, map.topLeft, map.middle, map.bottomRight, map.bottomLeft, map.bottom].join('');
  if (num == 9) return [map.top, map.topLeft, map.topRight, map.middle, map.bottomRight, map.bottom].join('');

  return '';
};

const mapMiddleFlip = (map: ClockMap) => {
  let temp = map.middle;
  map.middle = map.topLeft;
  map.topLeft = temp;
};

const mapRightSideFlip = (map: ClockMap) => {
  let temp = map.bottomRight;
  map.bottomRight = map.topRight;
  map.topRight = temp;
};

const findOnMap = (map: ClockMap, code: string): number => {
  const signals = code.split('');
  if (signals.length == 2) return 1;
  if (signals.length == 4) return 4;
  if (signals.length == 3) return 7;
  if (signals.length == 7) return 8;

  if (compareSignals2(code, getMapNumberAsString(map, 2))) return 2;
  if (compareSignals2(code, getMapNumberAsString(map, 3))) return 3;
  if (compareSignals2(code, getMapNumberAsString(map, 5))) return 5;
  if (compareSignals2(code, getMapNumberAsString(map, 6))) return 6;
  if (compareSignals2(code, getMapNumberAsString(map, 9))) return 9;

  return 0;
};

const createMap = (signals: string[]) => {
  const map: ClockMap = {};

  const signalOne = signals.find(s => s.length == 2);
  const signalFour = signals.find(s => s.length == 4);
  const signalSeven = signals.find(s => s.length == 3);
  const signalEight = signals.find(s => s.length == 7);
  markOnMap(map, signalOne);
  markOnMap(map, signalSeven);
  markOnMap(map, signalFour);


  const almostNine = getMapChars(map);

  const signalNine = signals.find(s => s.length == 6 && compareSignals(s, almostNine, 0));
  markOnMap(map, signalNine);

  const lastChar = signalEight?.split('').find(s => !signalNine?.split('').includes(s));

  map.bottomLeft = lastChar;

  return map;
};

const analyzeSignal = (map: ClockMap, signal: string) => {
  // cancer
  const case7 = [map.top, map.topLeft, map.topRight, map.middle, map.bottomLeft, map.bottom].join('');
  const case6 = [map.top, map.topLeft, map.topRight, map.middle, map.bottom].join('');
  const case1 = [map.top, map.topLeft, map.topRight, map.bottomRight, map.bottom].join('');
  const case4 = [map.top, map.topLeft, map.topRight, map.bottomLeft, map.bottom].join('');
  const case2 = [map.top, map.topLeft, map.middle, map.bottomLeft, map.bottom, map.topRight].join('');
  const case3 = [map.top, map.middle, map.bottomLeft, map.bottomRight, map.bottom, map.topRight].join('');
  const case5 = [map.topLeft, map.top, map.topRight, map.bottomRight, map.bottom].join('');
  const case8 = [map.top, map.topLeft, map.bottomLeft, map.bottom, map.bottomRight].join('');
  const case9 = [map.top, map.middle, map.bottomLeft, map.bottomRight, map.bottom].join('');

  const caseZero = [map.top, map.topLeft, map.topRight, map.bottomLeft, map.bottomRight, map.bottom].join('');

  if (compareSignals2(signal, caseZero)) {
    return;
  };

  if (compareSignals2(signal, case1)) mapMiddleFlip(map)
  else if (compareSignals2(signal, case2)) mapRightSideFlip(map)
  else if (compareSignals2(signal, case3)) mapMiddleFlip(map)
  else if (compareSignals2(signal, case4)) mapMiddleFlip(map)
  else if (compareSignals2(signal, case5)) mapMiddleFlip(map)
  else if (compareSignals2(signal, case6)) mapRightSideFlip(map)
  else if (compareSignals2(signal, case7)) mapRightSideFlip(map)
  else if (compareSignals2(signal, case8)) {
    mapRightSideFlip(map);
    mapMiddleFlip(map);
  }
  else if (compareSignals2(signal, case9)) {
    mapRightSideFlip(map);
  }
};

const solveLevel8Part2 = (input: InputData[]) => {
  let sum = 0;
  for (let i of input) {
    const map = createMap(i.pattern);
    let numAggr = '';
    for (let s of i.input) {
      let n = findOnMap(map, s);
      if (n == 0 && s.length) {
        analyzeSignal(map, s);
        n = findOnMap(map, s);
      }
      numAggr += n;
    }
    sum += parseInt(numAggr);
  }
  console.log(sum);
};

solveLevel8Part2(exampleInputPart2);
solveLevel8Part2(inputPart2);