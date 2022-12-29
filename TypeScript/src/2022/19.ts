import { max } from 'lodash';
import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';
import { numbers } from '../lib/ts-it/numbers';
import { keys } from '../lib/utils';

const MATS = ['ore', 'clay', 'obsidian'] as const;
type Mat = typeof MATS[number];
type MatBag = { [Key in Mat]: number };
const MatBag = {
  empty: { ore: 0, clay: 0, obsidian: 0 } as MatBag,
  toString: (bag: MatBag) => [bag.ore, bag.clay, bag.obsidian].join('-'),
};

type Blueprint = {
  id: number;
  costForRobot: {
    ore: MatBag;
    clay: MatBag;
    obsidian: MatBag;
    geode: MatBag;
  };
};

const input = getInput(19, 2022);
const bluePrints = stringToLines(input).map((line): Blueprint => {
  const [
    id,
    oreCostOfOreRobot,
    oreCostOfClayRobot,
    oreCostOfObsidianRobot,
    clayCostOfObsidianRobot,
    oreCostOfGeodeRobot,
    obsidianCostOfGeodeRobot,
  ] = numbers(line);
  return {
    id,
    costForRobot: {
      ore: { ...MatBag.empty, ore: oreCostOfOreRobot },
      clay: { ...MatBag.empty, ore: oreCostOfClayRobot },
      obsidian: {
        ...MatBag.empty,
        clay: clayCostOfObsidianRobot,
        ore: oreCostOfObsidianRobot,
      },
      geode: {
        ...MatBag.empty,
        obsidian: obsidianCostOfGeodeRobot,
        ore: oreCostOfGeodeRobot,
      },
    },
  };
});

let cache = {} as Record<string, number>;

function timeToBuy(matsPerMinute: MatBag, mats: MatBag, cost: MatBag) {
  return (
    Math.max(
      ...keys(matsPerMinute)
        .filter((key) => cost[key] > 0)
        .map((key) =>
          Math.ceil(Math.max(0, cost[key] - mats[key]) / matsPerMinute[key]),
        ),
    ) + 1
  );
}

function add(bagA: MatBag, bagB: MatBag, factor: number): MatBag {
  return {
    ore: bagA.ore + bagB.ore * factor,
    clay: bagA.clay + bagB.clay * factor,
    obsidian: bagA.obsidian + bagB.obsidian * factor,
  };
}

const ORDER = ['geode', ...MATS] as const;

function getMaxGeodeCount(
  bluePrint: Blueprint,
  timeRemaining: number,
  matsPerMinute: MatBag,
  mats: MatBag,
): number {
  if (timeRemaining <= 0) return 0;
  const key = [
    bluePrint.id,
    timeRemaining,
    MatBag.toString(matsPerMinute),
    MatBag.toString(mats),
  ].join('-');
  if (key in cache) return cache[key];

  let maxGeodeCount = 0;

  for (const key of ORDER) {
    const time = timeToBuy(matsPerMinute, mats, bluePrint.costForRobot[key]);
    const maxRequirements =
      key === 'geode'
        ? Infinity
        : max(
            keys(bluePrint.costForRobot).map(
              (k) => bluePrint.costForRobot[k][key],
            ),
          )!;
    const perMinuteGain = key === 'geode' ? 0 : matsPerMinute[key];
    if (perMinuteGain < maxRequirements && time < timeRemaining) {
      const newGeodeCount = key !== 'geode' ? 0 : timeRemaining - time;
      const newMatsPerMinute =
        key === 'geode'
          ? matsPerMinute
          : { ...matsPerMinute, [key]: matsPerMinute[key] + 1 };
      const newMats = add(
        add(mats, bluePrint.costForRobot[key], -1),
        matsPerMinute,
        time,
      );

      maxGeodeCount = Math.max(
        maxGeodeCount,
        newGeodeCount +
          getMaxGeodeCount(
            bluePrint,
            timeRemaining - time,
            newMatsPerMinute,
            newMats,
          ),
      );
      if (key === 'geode' && time === 1) break;
    }
  }

  cache[key] = maxGeodeCount;
  return maxGeodeCount;
}

let p1 = 0;
let p2 = 1;

bluePrints.forEach((b, i) => {
  console.log(`Starting with blueprint ${b.id}`);
  cache = {};
  p1 +=
    getMaxGeodeCount(
      b,
      24,
      { ore: 1, clay: 0, obsidian: 0 },
      { clay: 0, obsidian: 0, ore: 0 },
    ) * b.id;
  if (i < 3) {
    p2 *= getMaxGeodeCount(
      b,
      32,
      { ore: 1, clay: 0, obsidian: 0 },
      { clay: 0, obsidian: 0, ore: 0 },
    );
  }
});
console.log(p1);
console.log(p2);
