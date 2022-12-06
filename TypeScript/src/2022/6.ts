import getInput from '../lib/getInput';

const input = getInput(6, 2022);

function run(len: number) {
  for (let i = len; i < input.length; i++) {
    if (new Set(input.slice(i - len, i)).size === len) return i;
  }
}

console.log(run(4));
console.log(run(14));
