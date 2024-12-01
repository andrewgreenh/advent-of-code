import _ from 'lodash';
import getInput from '../lib/getInput';
import { chunk } from '../lib/ts-it/chunk';
import { enumerate } from '../lib/ts-it/enumerate';
import { map } from '../lib/ts-it/map';
import { range } from '../lib/ts-it/range';
import { reduce } from '../lib/ts-it/reduce';

let input = getInput(10, 2017).trim();
// input = 'AoC 2017'

function hash(input, rounds = 1, sequenceLength = 256) {
  let sequence = [...range(0, sequenceLength)];
  let index = 0;
  let skipSize = 0;
  for (let i of range(0, rounds)) {
    for (let length of input) {
      reverse(sequence, index, length);
      index = (index + length + skipSize) % sequence.length;
      skipSize++;
    }
  }
  return sequence;
}

function reverse(array, from, length) {
  let repeated = [...array, ...array];
  let reversed = repeated.slice(from, from + length).reverse();
  for (let [index, value] of enumerate(reversed)) {
    array[(index + from) % array.length] = value;
  }
  return reversed;
}

function knotHash(string, rounds) {
  const byteInput = [
    ...string.split('').map((str) => str.charCodeAt(0)),
    17,
    31,
    73,
    47,
    23,
  ];
  const knotted = hash(byteInput, rounds);
  const chunks = chunk<number>(16)(knotted);
  const chunkToNum = reduce<number, number>((a, b) => a ^ b, 0);
  const finalDecimalHash = map<Iterable<number>, number>(chunkToNum)(chunks);
  const hexResult = [
    ...map<number, string>((num) => _.padStart(num.toString(16), 2, '0'))(
      finalDecimalHash,
    ),
  ].join('');
  return hexResult;
}

const result1 = hash(map(Number)(input.trim().split(',')));
console.log(result1[0] * result1[1]);

console.log(knotHash(input, 64));
