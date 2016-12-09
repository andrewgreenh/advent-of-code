const _ = require('lodash');
require('../loadSlide');
const input = require('../getInput')(9, 2016).trim();

const re = /\(\d+x\d+\)/;

let remaining = input;
let result = '';
while (remaining.length > 0) {
  const match = remaining.match(re);
  if (match === null) {
    result += remaining;
    break;
  }
  result += remaining.slice(0, match.index);
  remaining = remaining.slice(match.index).replace(match[0], '');
  const [count, rep] = match[0].replace(/[()]/g, '').split('x').map(i => parseInt(i, 10));
  result += _.repeat(remaining.slice(0, count), rep);
  remaining = remaining.slice(count);
}

console.log(result.length);

function getSecond(input) {
  remaining = input;
  let sum = 0;
  let index = 0;
  while (true) {
    index++;
    if (index % 100000 === 0) {
      console.log(sum, remaining.length);
    }
    const match = remaining.match(re);
    if (match === null) {
      sum += remaining.length;
      break;
    }
    remaining = remaining.slice(match.index);
    sum += match.index;
    const [count, rep] = match[0].replace(/[()]/g, '').split('x').map(i => parseInt(i, 10));
    const startAfter = match[0].length;
    remaining = remaining.replace(
      match[0],
      _.repeat(remaining.slice(startAfter, startAfter + count), rep - 1)
    );
  }
  return sum;
}

console.log(getSecond(input));
