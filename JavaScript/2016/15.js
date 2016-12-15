const _ = require('lodash');
const lines = require('../getInput')(15, 2016).trim().split('\n');

const d = lines.map((l, index) => {
  const [, size, position] = l.match(/^\w+ #\d+ has (\d+) \w+; \w+ time=0, it is at \w+ (\d+)./);
  return t => ((+position + t + 1 + index) % +size === 0);
});
const d2 = [...d, t => ((t + 1 + 6) % 11 === 0)];

let t = 0;
while (!_.every(d, d => d(t))) t++;
console.log(t);

t = 0;
while (!_.every(d2, d => d(t))) t++;
console.log(t);
