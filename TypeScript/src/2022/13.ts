import getInput from '../lib/getInput';

type Message = number | Message[];

const input = getInput(13, 2022)
  .split('\n\n')
  .map(
    (lines) =>
      lines.split('\n').map((line) => JSON.parse(line) as Message) as [
        Message,
        Message,
      ],
  );

function order(a: Message, b: Message): 'correct' | 'incorrect' | 'equal' {
  if (typeof a === 'number' && typeof b === 'number') {
    if (a === b) return 'equal';
    if (a < b) return 'correct';
    if (a > b) return 'incorrect';
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    for (let i = 0; i < a.length && i < b.length; i++) {
      const o = order(a[i], b[i]);
      if (o !== 'equal') return o;
    }
    if (a.length < b.length) return 'correct';
    if (a.length > b.length) return 'incorrect';
    return 'equal';
  }
  if (typeof a === 'number') return order([a], b);
  if (typeof b === 'number') return order(a, [b]);

  throw new Error('should never happen!');
}

let part1 = 0;
input.forEach(([a, b], i) => {
  if (order(a, b) === 'correct') {
    part1 += i + 1;
  }
});
console.log(part1);

const key1 = [[2]];
const key2 = [[6]];
const input2 = getInput(13, 2022)
  .split('\n\n')
  .flatMap(
    (lines) =>
      lines.split('\n').map((line) => JSON.parse(line) as Message) as [
        Message,
        Message,
      ],
  )
  .concat([key1, key2])
  .sort((a, b) => {
    const o = order(a, b);
    if (o === 'correct') return -1;
    if (o === 'incorrect') return 1;
    return 0;
  });

console.log((input2.indexOf(key1) + 1) * (input2.indexOf(key2) + 1));
