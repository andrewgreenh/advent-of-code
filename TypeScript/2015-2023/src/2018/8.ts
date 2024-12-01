import { Deque } from '../lib/Deque';
import getInput from '../lib/getInput';
import { numbers } from '../lib/ts-it/numbers';
import { range } from '../lib/ts-it/range';
import { sum } from '../lib/ts-it/sum';
import { sumBy } from '../lib/ts-it/sumBy';

const input = getInput(8, 2018);

function buildTree(queue: Deque<number>): Node {
  const [cCount, mCount] = [queue.shift()!, queue.shift()!];
  return {
    children: [...range(0, cCount)].map(() => buildTree(queue)),
    metadata: [...range(0, mCount)].map(() => queue.shift()!),
  };
}

const tree = buildTree(new Deque(...numbers(input)));

const sumMeta = (node: Node) =>
  sumBy(sumMeta)(node.children) + sum(node.metadata);

const weirdSum = (node: Node) =>
  node.children.length
    ? sumBy((index: number) =>
        node.children[index - 1] ? weirdSum(node.children[index - 1]) : 0,
      )(node.metadata)
    : sum(node.metadata);

console.log(sumMeta(tree), weirdSum(tree));

interface Node {
  children: Node[];
  metadata: number[];
}
