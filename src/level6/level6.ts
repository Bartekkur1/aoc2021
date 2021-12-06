import { readAs } from "../util/readAs";
import { Presets, SingleBar } from 'cli-progress';

const progress = new SingleBar({}, Presets.shades_grey);

interface Fish {
  value: number;
  day: number;
}

// let fishesValues = [3, 4, 3, 1, 2];
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

progress.start(fishes.length, 0, {
  speed: "N/A"
});

let result = 0;

const days = 210;

const countFishFishes = (fish: Fish) => {
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

const spawnFishFishes = (fish: Fish) => {
  const fishesCount = countFishFishes(fish);

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
    spawnFishFishes(fish);
  }
};

const solveLevel2Part2 = (fishes: Fish[]) => {
  for (let fish of fishes) {
    result++;
    spawnFishFishes(fish);
    progress.increment();
  }
};

solveLevel2Part2(fishes);

progress.stop();
console.log(result);