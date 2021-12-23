import { omit, range } from 'lodash';
import getInput from '../lib/getInput';
import { assertAStarSuccess } from '../lib/lazy-graph/aStar';
import { LazyGraph } from '../lib/lazy-graph/LazyGraph';
import { abs } from '../lib/math/abs';
import { enumerate } from '../lib/ts-it/enumerate';

const input = getInput(23, 2021);
const lines = input.split('\n');

const hall = lines[1].slice(1).slice(0, -1).split('');
const rooms = [
  [lines[2][3], lines[3][3]],
  [lines[2][5], lines[3][5]],
  [lines[2][7], lines[3][7]],
  [lines[2][9], lines[3][9]],
];

type State = { hall: string[]; rooms: string[][]; cost: number };

const order = ['A', 'B', 'C', 'D'];
const costs = { A: 1, B: 10, C: 100, D: 1000 };
const roomEntranceByRoom = [2, 4, 6, 8];

const graph = new LazyGraph<State>({
  getNeighbours(s) {
    const { hall, rooms } = s;
    const neighbours: State[] = [];
    for (const [i, c] of enumerate(hall)) {
      if (c === '.') continue;
      const roomIndexOfPod = order.indexOf(c);
      const roomOfPod = rooms[roomIndexOfPod];
      const entranceOfTarget = roomEntranceByRoom[roomIndexOfPod];
      if (range(i, entranceOfTarget).some((j) => j !== i && hall[j] !== '.'))
        continue;

      if (roomOfPod.some((p) => p !== '.' && p !== c)) continue;
      const lastFree = roomOfPod.lastIndexOf('.');
      if (lastFree < 0) continue;
      neighbours.push({
        hall: replace(hall, i, '.'),
        rooms: replace(rooms, roomIndexOfPod, replace(roomOfPod, lastFree, c)),
        cost: (Math.abs(i - entranceOfTarget) + lastFree + 1) * costs[c],
      });
    }
    for (const [i, room] of enumerate(rooms)) {
      const firstToExit = room.findIndex((c) => c !== '.');
      if (firstToExit < 0) continue;
      const p = room[firstToExit];
      if (room.slice(firstToExit).every((c) => c === order[i])) continue;
      const roomEntry = roomEntranceByRoom[i];
      for (const [j, c] of enumerate(hall)) {
        if (roomEntranceByRoom.includes(j)) continue;
        if (c !== '.') continue;
        if (range(j, roomEntry).some((j) => hall[j] !== '.')) continue;
        neighbours.push({
          hall: replace(hall, j, p),
          rooms: replace(rooms, i, replace(room, firstToExit, '.')),
          cost: (abs(j - roomEntry) + firstToExit + 1) * costs[p],
        });
      }
    }
    return neighbours;
  },
  hashData: (d) => JSON.stringify(omit(d, 'cost')),
  getNeighbourCost: (d1, d2) => d2.cost,
});

const part1 = graph.findPath({
  startNode: { hall, rooms, cost: 0 },
  isEnd: (d) =>
    d.hall.every((c) => c === '.') &&
    d.rooms.every((r, i) => r.every((c) => c === order[i])),
});
assertAStarSuccess(part1);
console.log(part1.cost);

const toAdd = 'DD CB BA AC'.split(' ').map((x) => x.split(''));
const newRooms = rooms.map((room, i) => [room[0], ...toAdd[i], room[1]]);

const part2 = graph.findPath({
  startNode: { hall, rooms: newRooms, cost: 0 },
  isEnd: (d) =>
    d.hall.every((c) => c === '.') &&
    d.rooms.every((r, i) => r.every((c) => c === order[i])),
});
assertAStarSuccess(part2);
console.log(part2.cost);

part2.getPath().forEach((x) => logState(x.data));

function logState(s: State) {
  console.log('\n#############');
  console.log('#' + s.hall.join('') + '#');
  console.log(
    s.rooms[0]
      .map((_, i) =>
        i === 0
          ? '###' + s.rooms.map((r) => r[i]).join('#') + '###'
          : '  #' + s.rooms.map((r) => r[i]).join('#') + '#  ',
      )
      .join('\n'),
  );
  console.log('  #########  ');
  return s.hall.join('') + ' --- ' + s.rooms.map((r) => r.join('')).join(' ');
}

function replace<T>(array: T[], index: number, newValue: T) {
  return array.map((x, i) => (i === index ? newValue : x));
}
