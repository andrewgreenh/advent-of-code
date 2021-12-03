import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(3, 2021);
const lines = stringToLines(input).map((l) => l.split(''));

const findFactor = (order: string) => (lines: string[][], i: number) => {
  const zeroes = lines.filter((l) => l[i] === '0').length;
  return zeroes > lines.length / 2 ? order[0] : order[1];
};
const findGamma = findFactor('01');
const findEpsilon = findFactor('10');

const gamma = lines[0].map((_, i) => findGamma(lines, i)).join('');
const epsilon = lines[0].map((_, i) => findEpsilon(lines, i)).join('');

console.log(parseInt(gamma, 2) * parseInt(epsilon, 2));

const findMatch = (find: typeof findGamma) => {
  const result = lines[0].reduce(
    (lines, _, i) =>
      lines.length === 1 ? lines : lines.filter((l) => l[i] === find(lines, i)),
    lines,
  )[0];
  return parseInt(result.join(''), 2);
};

console.log(findMatch(findGamma) * findMatch(findEpsilon));
