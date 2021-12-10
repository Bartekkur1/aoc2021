import { readAs } from "../util/readAs";
import { cloneDeep } from 'lodash';

const exampleInput = readAs<string[]>({
  parser: (input) => {
    return input;
  },
  path: './src/level10/input',
  splitter: /\n|\r/
}).filter(e => e !== '');

const getChartPoint = (char: string): number => {
  switch (char) {
    case ')':
      return 1;
    case ']':
      return 2;
    case '}':
      return 3;
    case '>':
      return 4;
    default:
      throw new Error(char);
  }
};

const getClosingItem = (item: string) => {
  switch (item) {
    case "(":
      return ")";
    case "[":
      return "]";
    case "{":
      return "}";
    case "<":
      return ">";
    default:
      throw new Error(`Missing closing item: ${item}`);
  }
};

const isOpeningItem = (item: string): boolean => {
  return item == '(' || item == '[' || item == '{' || item == '<';
};

interface Item {
  value: string;
  index: string;
  isOpeningItem: boolean;
  nextItem?: Item;
  previousItem?: Item;
}

const readInput = (input: string): Item[] => {
  const items: Item[] = input.split('').map((value, index) => ({
    index: `${index}`,
    value,
    isOpeningItem: isOpeningItem(value)
  }));

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    item.nextItem = items[i + 1];
    item.previousItem = items[i - 1];
  }

  return items;
};

const findClosingItem = (item: Item): Item => {
  if (item.nextItem && item.nextItem.isOpeningItem) {
    return findClosingItem(item.nextItem);
  }
  const closingValue = getClosingItem(item.value);

  if (item.previousItem && item.nextItem && item.nextItem.value === closingValue) {
    item.previousItem.nextItem = item.nextItem!.nextItem;
    item.nextItem!.nextItem!.previousItem = item.previousItem;
    return findClosingItem(item.previousItem);
  } else {
    return item.nextItem!;
  }
};

const isInputCorrupted = (items: Item[]) => {
  try {
    const opened: Item[] = [];
    while (items.length) {
      const item = items.shift();
      if (item!.isOpeningItem) {
        opened.push(item!);
      } else {
        const lastOpen = opened.pop();
        const closingValue = getClosingItem(lastOpen!.value);
        if (item!.value !== closingValue) {
          throw new Error();
        }
      }
    }
  } catch (err) {
    return true;
  }
  return false;
};

const someClosed = (items: Item[]): boolean => {
  return items.find(i => i.isOpeningItem === false) !== undefined;
};

const reduceClosedItem = (items: Item[]): string => {
  let opened: Item[] = [];
  while (items.length && someClosed(items)) {
    const item = items.shift();
    if (item!.isOpeningItem) {
      opened.push(item!);
    } else {
      opened.pop();
    }
  }

  opened = opened.concat(items);

  console.log(opened.reduce((prev, curr) => prev += curr.value, ""), opened.reverse().map(i => getClosingItem(i.value)).reduce((prev, curr) => prev += curr, ""));

  return opened.map(i => getClosingItem(i.value)).reduce((prev, curr) => prev += curr, "");
};

let sums: number[] = [];
for (let input of exampleInput) {
  const parsed = readInput(input);
  if (isInputCorrupted(cloneDeep(parsed))) {
    continue;
  }

  const missingBrackets = reduceClosedItem(parsed);
  // console.log(missingBrackets);

  let sum = 0;
  for (let c of missingBrackets.split('')) {
    sum *= 5;
    sum += getChartPoint(c);
  }
  sums.push(sum);
}

const sortedSums = sums.sort((a, b) => b - a);
console.log(sortedSums);
console.log(Math.floor(sums.length / 2));
console.log(sortedSums[Math.floor(sums.length / 2)]);


// const sum = Object.keys(charCount).reduce((prev, curr) => prev += (getChartPoint(curr) * charCount[curr]), 0);

// console.log(sum);
