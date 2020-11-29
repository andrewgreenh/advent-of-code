import getInput from '../lib/getInput';
import { iterable } from '../lib/ts-it/iterable';
import { lines as stringToLines } from '../lib/ts-it/lines';
import { p } from '../lib/ts-it/pipe';

const input = getInput(14, 2019);
const lines = iterable(() => p(input)(stringToLines));

type Data = {
  count: number;
  material: string;
};
let relations: { inputs: Data[]; result: Data }[] = [];
for (const line of lines) {
  const matches = line.match(/(\d+ \w+)/g)!.map((m) => {
    const [, count, material] = m.match(/(\d+) (\w+)/)!;
    return { count: +count, material };
  });
  const inputs = matches!.slice(0, -1);
  const result = matches!.slice(-1)[0];

  relations.push({ inputs, result });
}

console.log(getOreRequirements('FUEL', 1).ORE);

function getOreRequirements(
  material: string,
  count: number,
  waste: ObjectOf<number> = {},
): { ORE: number; waste: ObjectOf<number> } {
  if (material === 'ORE') return { ORE: count, waste };
  const rel = relations.find((r) => r.result.material === material)!;
  let { [material]: previousMaterialWaste = 0, ...restWaste } = waste;
  const requriedCount = count - previousMaterialWaste;
  const multiplier = Math.ceil(requriedCount / rel.result.count);
  const newMaterialWaste = rel.result.count * multiplier - requriedCount;
  let oreSum = 0;
  for (const input of rel.inputs) {
    const req = getOreRequirements(
      input.material,
      input.count * multiplier,
      restWaste,
    );
    restWaste = req.waste;
    oreSum += req.ORE;
  }
  let resultingWaste = {
    ...restWaste,
  };
  if (!resultingWaste[material]) {
    resultingWaste[material] = 0;
  }
  resultingWaste[material] += newMaterialWaste;
  return {
    ORE: oreSum,
    waste: resultingWaste,
  };
}

let target = 1000000000000;
let fuel = 0;
let lastWaste = {};
let groups = [100000, 10000, 1000, 100, 10, 1];
let currentGroupIndex = 0;
while (target > 0) {
  if (!groups[currentGroupIndex]) break;
  let n = getOreRequirements('FUEL', groups[currentGroupIndex], lastWaste);

  if (target - n.ORE < 0) {
    currentGroupIndex++;
    continue;
  }

  target -= n.ORE;
  lastWaste = n.waste;
  fuel += groups[currentGroupIndex];
}
console.log(fuel);
