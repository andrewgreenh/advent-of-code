import { sumBy } from 'lodash';
import getInput from '../lib/getInput';
import permutations from '../lib/permutations';
import { stringToLines } from '../lib/ts-it/lines';
import { sum } from '../lib/ts-it/sum';

const input = getInput(8, 2021);
const lines = stringToLines(input);

const validNums = [
  'abcefg',
  'cf',
  'acdeg',
  'acdfg',
  'bcdf',
  'abdfg',
  'abdefg',
  'acf',
  'abcdefg',
  'abcdfg',
];

const possiblePermutations = permutations('abcdefg'.split(''));

const outputs1 = lines.map((line) => {
  const [input, output] = line.split(' | ').map((x) => x.split(' '));

  const correctPermutation = possiblePermutations.find((permutation) =>
    input
      .map((num) => mapWires(num, permutation))
      .every((num) => validNums.includes(num)),
  );

  return output
    .map((num) => mapWires(num, correctPermutation!))
    .map((num) => validNums.indexOf(num));
});
console.log(sumBy(outputs1.flat(), (n) => ([1, 4, 7, 8].includes(n) ? 1 : 0)));
console.log(sum(outputs1.map((n) => Number(n.join('')))));

function mapWires(num: string, permutation: string[]): string {
  return [...num]
    .map((letter) => 'abcdefg'[permutation.indexOf(letter)])
    .sort()
    .join('');
}
