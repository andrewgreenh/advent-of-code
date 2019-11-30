import getInput from '../lib/getInput';
import { aStar, AStarSuccessResult } from '../lib/lazy-graph/aStar';
import { filter } from '../lib/ts-it/filter';
import { find } from '../lib/ts-it/find';
import { first } from '../lib/ts-it/first';
import { flatMap } from '../lib/ts-it/flatMap';
import { last } from '../lib/ts-it/last';
import { lines as stringToLines } from '../lib/ts-it/lines';
import { map } from '../lib/ts-it/map';
import { minBy } from '../lib/ts-it/minBy';
import { pipe } from '../lib/ts-it/pipe';
import { printGrid } from '../lib/ts-it/printGrid';
import { sumBy } from '../lib/ts-it/sumBy';

const input = getInput(15, 2018);

type Vector = [number, number];

class World {
  constructor(public map: string[][]) {}
  distanceBetweenPositions = (posA: Vector, posB: Vector) => {
    const result = aStar<Vector>({
      estimateCost: ([x, y]) => Math.abs(x - posB[0]) + Math.abs(y - posB[1]),
      getNeighbours: this.getNeighbours,
      isEnd: ([x, y]) => posB[0] === x && posB[1] === y,
      startNode: posA,
    });
    return result.isFail() ? null : result;
  };
  getNeighbours = ([x, y]: Vector) => {
    const m = this.map;
    return ([
      [x + 1, y],
      [x, y + 1],
      [x - 1, y],
      [x, y - 1],
    ] as Vector[]).filter(([x, y]) => m[y][x] === '.');
  };
  print = () => printGrid(this.map, '', '');
}

class Unit {
  p = 3;
  hp = 200;
  enemies: Unit[];
  ownTroups: Unit[];
  enemy: 'G' | 'E';
  dead = false;
  constructor(
    public pos: Vector,
    public type: 'G' | 'E',
    public world: World,
    public allUnits: Unit[],
    goblins: Unit[],
    elves: Unit[],
  ) {
    this.ownTroups = type === 'G' ? goblins : elves;
    this.enemies = type === 'G' ? elves : goblins;
    this.enemy = type === 'G' ? 'E' : 'G';
  }

  turn() {
    if (this.dead) return;
    if (!this.attack()) this.move(), this.attack();
  }

  die() {
    this.allUnits.splice(this.allUnits.indexOf(this), 1);
    this.ownTroups.splice(this.ownTroups.indexOf(this), 1);
    this.world.map[this.pos[1]][this.pos[0]] = '.';
    this.dead = true;
  }

  attack() {
    const enemy = this.findEnemy();
    if (!enemy) return false;
    enemy.hp -= this.p;
    if (enemy.hp <= 0) enemy.die();
    return true;
  }

  findEnemy() {
    return pipe(this.enemies)(
      sortUnits,
      find(
        ({ pos: [ex, ey] }) =>
          Math.abs(ex - this.pos[0]) + Math.abs(ey - this.pos[1]) === 1,
      ),
    );
  }

  move() {
    const bestPathsToEnemy = [
      ...pipe(this.enemies)(
        flatMap(({ pos }) => this.world.getNeighbours(pos)),
        sortPositions,
        map(pos => this.world.distanceBetweenPositions(this.pos, pos)),
        filter(r => r !== null),
      ),
    ] as AStarSuccessResult<Vector>[];
    if (bestPathsToEnemy.length === 0) return;
    const bestPathToEnemy = minBy<AStarSuccessResult<Vector>>(r => r.cost)(
      bestPathsToEnemy,
    )!;
    const next = pipe(this.pos)(
      this.world.getNeighbours,
      sortPositions,
      map(nextPlace => {
        const lastOfBestPath = last(bestPathToEnemy.getPath())!;
        return this.world.distanceBetweenPositions(
          nextPlace,
          lastOfBestPath.data,
        );
      }),
      filter(r => r !== null),
      minBy(x => x!.cost),
      result => first(result!.getPath())!.data,
    );
    const [nx, ny] = next;
    const [x, y] = this.pos;
    this.world.map[y][x] = '.';
    this.world.map[ny][nx] = this.type;
    this.pos = [nx, ny];
  }
}

function sortPositions(vectors: Iterable<Vector>) {
  return [...vectors].sort((a, b) => a[1] * 1000 + a[0] - (b[1] * 1000 + b[0]));
}

function sortUnits(units: Iterable<Unit>) {
  return [...units].sort(
    (a, b) =>
      a.hp * 1000000 +
      a.pos[1] * 1000 +
      a.pos[0] -
      (b.hp * 1000000 + b.pos[1] * 1000 + b.pos[0]),
  );
}

function sortUnitsByPosition(units: Iterable<Unit>) {
  return [...units].sort(
    (a, b) => a.pos[1] * 10000 + a.pos[0] - (b.pos[1] * 10000 + b.pos[0]),
  );
}

function simulate(elvenPowerLevel = 3, print = false) {
  let allUnits: Unit[] = [];
  let elves: Unit[] = [];
  let goblins: Unit[] = [];
  const world = new World([...stringToLines(input)].map(line => [...line]));
  world.map.forEach((line, y) =>
    [...line].forEach((char, x) => {
      if ('EG'.includes(char)) {
        const newUnit = new Unit(
          [x, y],
          char as 'E' | 'G',
          world,
          allUnits,
          goblins,
          elves,
        );
        if (char === 'G') goblins.push(newUnit);
        if (char === 'E') elves.push(newUnit), (newUnit.p = elvenPowerLevel);
        allUnits.push(newUnit);
      }
    }),
  );
  const initialLength = elves.length;
  let i = 0;
  while (elves.length > 0 && goblins.length > 0) {
    sortUnitsByPosition(allUnits).forEach(u => u.turn());
    if (print) world.print();
    i++;
  }
  return { allUnits, elves, goblins, i, initialLength };
}

const part1 = simulate(3);
const sum = pipe(part1.allUnits)(sumBy(u => u.hp));
console.log((part1.i - 1) * sum);

let p = 4;
while (true) {
  const { initialLength, elves, allUnits, i } = simulate(p);
  if (initialLength === elves.length) {
    const sum = pipe(allUnits)(sumBy(u => u.hp));
    console.log((i - 1) * sum);
    break;
  }
  p++;
}
