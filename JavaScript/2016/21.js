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
const rotateS = (s, a) => {
  const index = s.indexOf(a);
  return rotateR(s, 1 + index + (index >= 4 ? 1 : 0));
};
const reverse = (s, i, j) =>
  s.substr(0, i) + s.substr(i, j-i+1).split('').reverse().join('') + s.substr(j + 1);
const move = (s, i, j) => flow(remove(i), insert(s[i], j))(s);

const ops = {
  reverse: rest => s => reverse(s, +rest[1], +rest[3]),
  rotate: rest => {
    if (rest[0] === 'left') return s => rotateL(s, +rest[1]);
    if (rest[0] === 'right') return s => rotateR(s, +rest[1]);
    return s => rotateS(s, rest[5]);
  },
  swap: rest => {
    if (rest[0] === 'position') return s => swapAt(s, +rest[1], +rest[4]);
    return s => swap(s, rest[1], rest[4]);
  },
  move: rest => s => move(s, +rest[1], +rest[4]),
};

const reverseOps = {
  reverse: rest => s => reverse(s, +rest[3], +rest[1]),
  rotate: rest => {
    if (rest[0] === 'left') return s => rotateR(s, +rest[1]);
    if (rest[0] === 'right') return s => rotateL(s, +rest[1]);
    return s => rotateS(s, rest[5]);
  },
  swap: rest => {
    if (rest[0] === 'position') return s => swapAt(s, +rest[4], +rest[1]);
    return s => swap(s, rest[4], rest[1]);
  },
  move: rest => s => move(s, +rest[4], +rest[1]),
};

const parse = ops => line => {
  const [command, ...rest] = line.split(' ');
  return (...args) => { console.log(...args); return ops[command](rest)(...args); };
};

// const result1 = lines.map(parse(ops)).reduce((last, fn) => fn(last), start);
const result2 = lines.reverse().map(parse(reverseOps)).reduce((last, fn) => fn(last), start);
console.log(result2);
