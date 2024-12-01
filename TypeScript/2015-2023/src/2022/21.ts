import { keyBy, reverse } from 'lodash';
import { assert } from '../lib/assert';
import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';

const operators = {
  '+': (a, b) => a + b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  '-': (a, b) => a - b,
} satisfies { [key: string]: (a: number, b: number) => number };

type PlainNode = {
  type: 'plain';
  name: string;
  num: number;
};
type OpNode = {
  type: 'op';
  name: string;
  left: string;
  op: keyof typeof operators;
  right: string;
};
type Node = PlainNode | OpNode;

const input = getInput(21, 2022);
const nodes = stringToLines(input).map((line): Node => {
  const [, name, operation] = line.match(/(.*): (.*)/)!;
  const numMatch = operation.match(/^(\d+)$/);
  if (numMatch) return { name, num: +numMatch[1], type: 'plain' };

  const [, a, op, b] = operation.match(/([a-z]+) (.) ([a-z]+)/)!;
  return { name, op: op as any, left: a, right: b, type: 'op' };
});
const nodesById = keyBy(nodes, (l) => l.name);

const ordered: string[] = [];
function findAll(node: Node): void {
  ordered.push(node.name);
  if (node.type === 'plain') return;

  findAll(nodesById[node.left]);
  findAll(nodesById[node.right]);
}
findAll(nodesById.root);
reverse(ordered);

for (const id of ordered) {
  const node = nodesById[id];
  if (node.type === 'plain') continue;
  const left = nodesById[node.left];
  const right = nodesById[node.right];
  if (
    left.name === 'humn' ||
    left.type === 'op' ||
    right.name === 'humn' ||
    right.type === 'op'
  )
    continue;
  nodesById[node.name] = {
    type: 'plain',
    name: node.name,
    num: operators[node.op](left.num, right.num),
  };
}

function exec(node: Node): number {
  if (node.type === 'plain') return node.num;

  return operators[node.op](
    exec(nodesById[node.left]),
    exec(nodesById[node.right]),
  );
}

console.log(exec(nodesById.root));

function find(target: number, node: Node): number {
  if (node.name === 'humn') return target;
  assert(
    node.type === 'op',
    `Can not find ${target} in plain node ${node.name}`,
  );

  const left = nodesById[node.left];
  const right = nodesById[node.right];
  if (left.type === 'plain' && (right.type === 'op' || right.name === 'humn')) {
    switch (node.op) {
      case '*':
        return find(target / left.num, right);
      case '+':
        return find(target - left.num, right);
      case '-':
        return find(-1 * (target - left.num), right);
      case '/':
        return find(1 / (target / left.num), right);
    }
  }

  if (right.type === 'plain' && (left.type === 'op' || left.name === 'humn')) {
    switch (node.op) {
      case '*':
        return find(target / right.num, left);
      case '+':
        return find(target - right.num, left);
      case '-':
        return find(target + right.num, left);
      case '/':
        return find(target * right.num, left);
    }
  }

  throw new Error('Should never happen. please?');
}

assert(nodesById.root.type === 'op');
const left = nodesById[nodesById.root.left];
const right = nodesById[nodesById.root.right];
if (left.type === 'plain') console.log(find(left.num, right));
if (right.type === 'plain') console.log(find(right.num, left));
