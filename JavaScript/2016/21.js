const lines = require('../getInput')(21, 2016).trim().split('\n');
const start = 'abcdefgh';

const swapAt = (s, i, j) => s.substr(0, i) + s[j] + s.substr(i+1, j-i-1) + s[i] + s.substr(j+1);
const swap = (s, a, b) =>
  s.replace(new RegExp(a, 'g'), '%%%').replace(new RegExp(b, 'g'), a).replace(/%%%/g, b);
const rotateL = (s, n) => s.substr(n % s.length) + s.substr(0, n % s.length);
const rotateR = (s, n) => s.substr(-(n % s.length)) + s.substr(0, s.length - (n % s.length));
const rotateS = (s, a) => {
  const index = s.indexOf(a);
  return rotateR(s, 1 + ((index) % s.length) + (index >= 4 ? 1 : 0));
};
const reverse = (s, i, j) =>
  s.substr(0, i) + s.substr(i, j-i+1).split('').reverse().join('') + s.substr(j+1);
const remove = (s, i) => s.substr(0, i) + s.substr(i + 1);
const insert = (s, i, x) => s.substr(0, i) + x + s.substr(i);
const move = (s, i, j) => insert(remove(s, i), j, s[i]);

const ops = {
  reverse: rest => s => reverse(s, rest[1], rest[3]),
  rotate: rest => {
    if (rest[0] === 'left') return s => rotateL(s, rest[1]);
    if (rest[0] === 'right') return s => rotateR(s, rest[1]);
    return s => rotateS(s, rest[5]);
  },
  swap: rest => {
    if (rest[0] === 'position') return s => swapAt(s, rest[1], rest[4]);
    return s => swap(s, rest[1], rest[4]);
  },
  move: rest => s => move(s, rest[1], rest[4]),
};

function parse(line) {
  const [command, ...rest] = line.split(' ');
  return (...args) => { console.log(args); return ops[command](rest)(...args); };
}

const fns = lines.map(parse);
const result = fns.reduce((last, fn) => fn(last), start);
console.log(result);
