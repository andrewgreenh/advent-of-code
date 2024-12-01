import getInput from '../lib/getInput';
import { ceil } from '../lib/math/ceil';
import { floor } from '../lib/math/floor';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(18, 2021);
const lines = stringToLines(input);

const resultingNum = lines.map(parseSnailFish).reduce((a, b) => add(a, b));

console.log(calculateMagnitude(resultingNum));

let max = 0;
for (const lineA of lines) {
  for (const lineB of lines) {
    if (lineA === lineB) continue;
    const magnitude = calculateMagnitude(
      add(parseSnailFish(lineA), parseSnailFish(lineB)),
    );
    if (magnitude > max) max = magnitude;
  }
}
console.log(max);

/**
 * Snailfish base utils
 */
type LiteralSnailfishNumber = {
  value: number;
  parent?: PairSnailfishNumber;
};
type PairSnailfishNumber = {
  values: [SnailfishNumber, SnailfishNumber];
  parent?: PairSnailfishNumber;
};
function isPair(num: SnailfishNumber): num is PairSnailfishNumber {
  return 'values' in num;
}
function isLiteral(num: SnailfishNumber): num is LiteralSnailfishNumber {
  return 'value' in num;
}
type SnailfishNumber = LiteralSnailfishNumber | PairSnailfishNumber;

function calculateMagnitude(num: SnailfishNumber): number {
  if (isLiteral(num)) return num.value;
  return (
    calculateMagnitude(num.values[0]) * 3 +
    calculateMagnitude(num.values[1]) * 2
  );
}

/**
 * Snailfish math functions
 */
function add(
  num1: SnailfishNumber,
  num2: SnailfishNumber,
): PairSnailfishNumber {
  const newNumber: SnailfishNumber = { values: [num1, num2] };
  num1.parent = num2.parent = newNumber;
  reduce(newNumber);
  return newNumber;
}

/**
 * Snailfish reduction
 */
function reduce(num: SnailfishNumber) {
  let splitted = true;
  let exploded = true;
  while (splitted || exploded) {
    exploded = explode(num);
    if (exploded) continue;
    splitted = split(num);
  }
}

function explode(num: SnailfishNumber, level = 0): boolean {
  if (isLiteral(num)) return false;
  const left = num.values[0];
  const right = num.values[1];

  if (level < 4 || !isLiteral(left) || !isLiteral(right)) {
    const leftExploded = explode(left, level + 1);
    if (leftExploded) return true;
    const rightExploded = explode(right, level + 1);
    return rightExploded;
  }

  const leftNeighbour = findLiteralOnOneSide(num, 0);
  if (leftNeighbour) leftNeighbour.value += left.value;
  const rightNeihbour = findLiteralOnOneSide(num, 1);
  if (rightNeihbour) rightNeihbour.value += right.value;

  const newNode = { value: 0, parent: num.parent };
  if (num.parent!.values[0] === num) num.parent!.values[0] = newNode;
  if (num.parent!.values[1] === num) num.parent!.values[1] = newNode;

  return true;
}

function split(num: SnailfishNumber): boolean {
  if (isLiteral(num) && num.value < 10) return false;

  if (isPair(num)) {
    const leftSplitted = split(num.values[0]);
    if (leftSplitted) return true;
    const rightSplitted = split(num.values[1]);
    return rightSplitted;
  }

  const leftOrRightChild = num.parent!.values.indexOf(num) as 0 | 1;
  const pairToReplaceNum: PairSnailfishNumber = {
    parent: num.parent,
    values: [] as any,
  };

  num.parent!.values[leftOrRightChild] = pairToReplaceNum;
  pairToReplaceNum.values[0] = {
    parent: pairToReplaceNum,
    value: floor(num.value / 2),
  };
  pairToReplaceNum.values[1] = {
    parent: pairToReplaceNum,
    value: ceil(num.value / 2),
  };

  return true;
}

function findLiteralOnOneSide(
  num: PairSnailfishNumber,
  leftOrRight: 0 | 1,
): LiteralSnailfishNumber | null {
  if (!num.parent) return null;
  if (num.parent.values[leftOrRight] === num) {
    return findLiteralOnOneSide(num.parent, leftOrRight);
  }

  return findLiteralIn(
    num.parent.values[leftOrRight],
    (1 - leftOrRight) as 0 | 1,
  );
}

function findLiteralIn(
  num: SnailfishNumber,
  leftOrRight: 0 | 1,
): LiteralSnailfishNumber {
  if (isLiteral(num)) return num;
  return findLiteralIn(num.values[leftOrRight], leftOrRight);
}

/**
 * Snailfish parsing and serialisation
 */
type Node =
  | { type: 'LITERAL'; value: number }
  | { type: 'PAIR'; children: [Node, Node] };

function parseNumber(s: string[]): [parsedNode: Node, rest: string[]] {
  let [head, ...tail] = s;
  if (head.match(/\d/)) return [{ type: 'LITERAL', value: +head }, tail];

  const left = parseNumber(tail);
  [, [head, ...tail]] = left;
  const right = parseNumber(tail);
  [, [head, ...tail]] = right;
  return [{ type: 'PAIR', children: [left[0], right[0]] }, tail];
}

function parseSnailFish(s: string) {
  return nodeToSnailfishNumber(parseNumber(s.split(''))[0]);
}

function stringifySnailfishNumber(num: SnailfishNumber): string {
  if (isLiteral(num)) return String(num.value);
  return [
    '[',
    stringifySnailfishNumber(num.values[0]),
    ',',
    stringifySnailfishNumber(num.values[1]),
    ']',
  ].join('');
}

function nodeToSnailfishNumber(
  node: Node,
  parent?: PairSnailfishNumber,
): SnailfishNumber {
  if (node.type === 'LITERAL') return { value: node.value, parent };

  const newNumber: SnailfishNumber = { parent, values: [] as any };
  newNumber.values[0] = nodeToSnailfishNumber(node.children[0], newNumber);
  newNumber.values[1] = nodeToSnailfishNumber(node.children[1], newNumber);
  return newNumber;
}
