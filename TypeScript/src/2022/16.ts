import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';
import { numbers } from '../lib/ts-it/numbers';

const input = getInput(16, 2022);
const valves = stringToLines(input).map((line) => {
  const id = line.split(' ')[1];
  const rate = numbers(line)[0];
  const targets = line.match(/[A-Z][A-Z]/g)!.slice(1);
  return {
    id,
    rate,
    targets,
  };
});
type Valve = typeof valves[number];

const costsPerPair: { [Key: string]: { [Key: string]: number } } = {};

function addPair(s: string, t: string, dist: number) {
  if (!(s in costsPerPair)) costsPerPair[s] = {};
  if (!(t in costsPerPair)) costsPerPair[t] = {};
  if (dist < (costsPerPair[t][s] ?? Infinity)) {
    someChanged = true;
    costsPerPair[t][s] = dist;
  }
  if (dist < (costsPerPair[s][t] ?? Infinity)) {
    someChanged = true;
    costsPerPair[s][t] = dist;
  }
}

let someChanged = true;
while (someChanged) {
  someChanged = false;

  for (const v of valves) {
    for (const t of v.targets) {
      addPair(v.id, t, 1);
    }

    for (const t of Object.keys(costsPerPair[v.id])) {
      for (const tt of Object.keys(costsPerPair[t])) {
        addPair(v.id, tt, costsPerPair[v.id][t] + costsPerPair[t][tt]);
      }
    }
  }
}

const valvesWithFlow = valves.filter((v) => v.rate > 0);

let c = new Map<string, number>();
function getScore(missing: number, position: Valve, timeLimit: number): number {
  const key = [missing.toString(2), position.id, timeLimit].join('-');
  if (c.has(key)) return c.get(key)!;
  if (missing === 0) {
    return 0;
  }
  let bestOption = 0;
  for (let valveIndex = 0; valveIndex < valvesWithFlow.length; valveIndex++) {
    const num = 2 ** valveIndex;
    const newMissing = missing & ~num;
    const visited = newMissing === missing;
    if (visited) continue;
    const next = valvesWithFlow[valveIndex];
    const time = costsPerPair[position.id][next.id] + 1;
    if (time <= timeLimit) {
      const score =
        next.rate * (timeLimit - time) +
        getScore(newMissing, next, timeLimit - time);
      bestOption = Math.max(score, bestOption);
    }
  }
  c.set(key, bestOption);
  return bestOption;
}

let allValves = 2 ** valvesWithFlow.length - 1;
const start = valves.find((v) => v.id === 'AA')!;
console.log(getScore(allValves, start, 30));

let best = 0;
for (let i = 0; i <= allValves; i++) {
  const a = getScore(i, start, 26);
  const b = getScore(allValves & ~i, start, 26);
  best = Math.max(best, a + b);
}
console.log(best);
console.log(c.size);
