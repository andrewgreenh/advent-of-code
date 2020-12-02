import getInput from '../lib/getInput';
import { find } from '../lib/ts-it/find';
import { stringToLines } from '../lib/ts-it/lines';
import { minBy } from '../lib/ts-it/minBy';
import { numbers } from '../lib/ts-it/numbers';
import { pipe } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';
import { sortBy } from '../lib/ts-it/sortBy';
import { sumBy } from '../lib/ts-it/sumBy';

type Group = {
  count: number;
  hp: number;
  dmg: number;
  init: number;
  dmgType: string;
  imm: string[];
  weak: string[];
  target?: Nillable<Group>;
};
let imGroups: Group[] = [];
let inGroups: Group[] = [];
let current = imGroups;
for (const line of stringToLines(getInput(24, 2018))) {
  if (line.includes('Inf')) current = inGroups;
  if (line.includes('Inf') || line.includes('Sys')) continue;
  current.push(lineToGroup(line));
}

console.log(
  pipe(play(imGroups, inGroups).remaining)(sumBy<Group>((g) => g.count)),
);

const lowestBoost = pipe(range(0))(
  find((b) => pipe(play(imGroups, inGroups, b))((x) => x.won)),
);
console.log(
  pipe(play(imGroups, inGroups, lowestBoost).remaining)(sumBy((g) => g.count)),
);

function play(imGroups: Group[], inGroups: Group[], boost = 0) {
  imGroups = imGroups.map((g) => ({ ...g, dmg: g.dmg + boost }));
  inGroups = inGroups.map((g) => ({ ...g }));
  while (imGroups.length > 0 && inGroups.length > 0) {
    let killedSomeone = false;
    selectTarget(inGroups, imGroups);
    selectTarget(imGroups, inGroups);
    for (const attacker of pipe([...imGroups, ...inGroups])(
      sortBy((g) => -g.init),
    )) {
      if (attacker.count === 0) continue;
      if (attacker.target) {
        const d = dmg(attacker, attacker.target);
        const killCount = Math.floor(d / attacker.target.hp);
        if (killCount > 0) killedSomeone = true;
        attacker.target.count -= killCount;
        if (attacker.target.count < 0) attacker.target.count = 0;
      }
    }
    imGroups = imGroups.filter((g) => g.count !== 0);
    inGroups = inGroups.filter((g) => g.count !== 0);
    if (!killedSomeone) return { won: false, remaining: [] };
  }
  return { won: imGroups.length > 0, remaining: [...imGroups, ...inGroups] };
}

function lineToGroup(line: string): Group {
  const [count, hp, dmg, init] = numbers(line);
  const dmgType = (line.match(/\d+ (\w*) damage/) || [])[1];
  const imm = ((line.match(/immune to ((\w*(, )?)+)[;)]/) || [])[1] || '')
    .split(', ')
    .filter(Boolean);
  const weak = ((line.match(/weak to ((\w*(, )?)+)[;)]/) || [])[1] || '')
    .split(', ')
    .filter(Boolean);
  return { count, dmg, dmgType, hp, imm, weak, init };
}

function selectTarget(groups: Iterable<Group>, otherGroups: Iterable<Group>) {
  const sorted = pipe([...groups])(sortBy((g) => [-g.count * g.dmg, -g.init]));
  const defenders = [...otherGroups];
  for (const attacker of sorted) {
    const target = pipe(defenders)(
      minBy((d) => [-dmg(attacker, d), -d.count * d.dmg, -d.init]),
    );
    if (target && dmg(attacker, target) > 0) {
      attacker.target = target;
      defenders.splice(defenders.indexOf(target), 1);
    } else {
      attacker.target = null;
    }
  }
}

function dmg(a: Group, d: Group) {
  return (
    a.count *
    a.dmg *
    (d.weak.includes(a.dmgType) ? 2 : d.imm.includes(a.dmgType) ? 0 : 1)
  );
}
