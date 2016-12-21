const permute = require('../permutate');
const lines = require('../getInput')(21, 2016).trim().split('\n');

const start = 'abcdefgh';
const end = 'fbgdceah';
const flow = (...fns) => arg => fns.reduce((last, fn) => fn(last), arg);
const remove = i => s => s.substr(0, i) + s.substr(i + 1);
const insert = (x, i) => s => s.substr(0, i) + x + s.substr(i);
const swapAt = (s, i, j) => {
  const [first, last] = [i, j].sort();
  return flow(remove(last), remove(first), insert(s[last], first), insert(s[first], last))(s);
};
const swap = (s, a, b) =>
  s.replace(new RegExp(a, 'g'), '%%%').replace(new RegExp(b, 'g'), a).replace(/%%%/g, b);
const rotateL = (s, n) =>
  (n % s.length === 0 ? s : s.substr(n % s.length) + s.substr(0, n % s.length));
const rotateR = (s, n) =>
  (n % s.length === 0 ? s : s.substr(-(n % s.length)) + s.substr(0, s.length - (n % s.length)));
const rotateS = (s, a, mappings) => rotateR(s, mappings[s.indexOf(a)]);
const reverse = (s, i, j) =>
  s.substr(0, i) + s.substr(i, j-i+1).split('').reverse().join('') + s.substr(j + 1);
const move = (s, i, j) => flow(remove(i), insert(s[i], j))(s);

const ops = {
  reverse: rest => s => reverse(s, +rest[1], +rest[3]),
  rotate: rest => {
    if (rest[0] === 'left') return s => rotateL(s, +rest[1]);
    if (rest[0] === 'right') return s => rotateR(s, +rest[1]);
    return s => rotateS(s, rest[5], [1, 2, 3, 4, 6, 7, 0, 1]);
  },
  swap: rest => {
    if (rest[0] === 'position') return s => swapAt(s, +rest[1], +rest[4]);
    return s => swap(s, rest[1], rest[4]);
  },
  move: rest => s => move(s, +rest[1], +rest[4]),
};

const parse = line => {
  const [command, ...rest] = line.split(' ');
  return (...args) => ops[command](rest)(...args);
};

const scramble = flow(...lines.map(parse));
const result1 = scramble(start);
console.log(result1);
console.time('part2');
const result2 = permute(start.split('')).map(i => i.join('')).filter(s => scramble(s) === end)[0];
console.timeEnd('part2');
console.log(result2);
