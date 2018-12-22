import { aStar } from '../lib/aStar';
import getInput from '../lib/getInput';
import { lines } from '../lib/ts-it/lines';
import { numbers } from '../lib/ts-it/numbers';
import { range } from '../lib/ts-it/range';

const strings = [...lines(getInput(22, 2018))];
const depth = numbers(strings[0])[0];
const target = numbers(strings[1]);
const start = [0, 0];

const cache = { [key(start)]: 0, [key(target)]: 0 };
function getLevel(pos: number[]) {
  const k = key(pos);
  if (cache[k] !== undefined) return cache[k];
  const [x, y] = pos;
  let index = -1;
  if (y === 0) index = x * 16807;
  else if (x === 0) index = y * 48271;
  else index = getLevel([x - 1, y]) * getLevel([x, y - 1]);
  cache[k] = (index + depth) % 20183;
  return cache[k];
}
function risk(pos: number[]) {
  return getLevel(pos) % 3;
}

function key([a, b]: number[]) {
  return `${a}%${b}`;
}

let sum = 0;
for (const y of range(0, target[1] + 1))
  for (const x of range(0, target[0] + 1)) sum += risk([x, y]);
console.log(sum);

type Node = {
  stuff: 'climbing-gear' | 'torch' | 'neither';
  pos: number[];
};

const hashNode = (node: Node) => `${node.stuff}%${key(node.pos)}`;
const path = aStar<Node>({
  estimationWeight: 0,
  getNeighbourCost: (a, b) => (a.stuff === b.stuff ? 1 : 7),
  getNeighbours: node => {
    return [...possiblePossitions(node), possibleEquipment(node)];
  },
  hashData: n => hashNode(n),
  isEnd: node => key(node.pos) === key(target) && node.stuff === 'torch',
  startNode: { stuff: 'torch', pos: start },
});

console.log(path.isSuccess() && path.cost);

function possibleEquipment(node: Node): Node {
  if (risk(node.pos) === 0) {
    return {
      pos: node.pos,
      stuff: node.stuff === 'torch' ? 'climbing-gear' : 'torch',
    };
  }
  if (risk(node.pos) === 1) {
    return {
      pos: node.pos,
      stuff: node.stuff === 'neither' ? 'climbing-gear' : 'neither',
    };
  }
  return {
    pos: node.pos,
    stuff: node.stuff === 'torch' ? 'neither' : 'torch',
  };
}

function possiblePossitions(node: Node): Node[] {
  const [x, y] = node.pos;
  const candidatedPositions = [[x + 1, y], [x, y + 1], [x - 1, y], [x, y - 1]];
  return candidatedPositions.map(pos => ({ ...node, pos })).filter(isLegal);
}

function isLegal(node: Node) {
  if (node.pos[0] < 0 || node.pos[1] < 0) return false;
  if (risk(node.pos) === 0 && node.stuff === 'neither') return false;
  if (risk(node.pos) === 1 && node.stuff === 'torch') return false;
  if (risk(node.pos) === 2 && node.stuff === 'climbing-gear') return false;
  return true;
}
