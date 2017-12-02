import getInput from '../lib/getInput';

const result = (number: string, offset: number) =>
  number
    .split('')
    .filter((char, index, array) => char === array[(index + offset) % array.length])
    .reduce((a, b) => a + +b, 0);

const input = getInput(1, 2017).trim();

console.log(result(input, 1));
console.log(result(input, input.length / 2));
