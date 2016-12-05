const { createHash } = require('crypto');
const _ = require('lodash');
const start = require('../getInput')(5, 2016).trim();

let result1 = '';
const result2 = '________'.split('');
let result2Length = 0;
let bothDone = false;
let int = 0;

const getCoolString = done => {
  if (_.isString(done)) {
    return done + _.times(8 - done.length, () => _.random(15).toString(16)).join('');
  }
  done = done.join('');
  _.times(8 - result2Length, () => { done = done.replace('_', _.random(15).toString(16)); });
  return done;
};

while (!bothDone) {
  const hash = createHash('md5').update(start + int).digest('hex');
  int++;
  if (int % 10000 === 0) {
    process.stdout.write(`${getCoolString(result1)} - ${getCoolString(result2)}\r`);
  }

  if (hash.slice(0, 5) !== '00000') continue;

  if (result1.length < 8) {
    result1 += hash[5];
    process.stdout.write(`${getCoolString(result1)} - ${getCoolString(result2)}\r`);
  }

  if (result2Length < 8) {
    const num = Number(hash[5]);
    if (isNaN(num) || num > 7) continue;
    if (result2[num] !== '_') continue;
    result2[num] = hash[6];
    result2Length++;
    process.stdout.write(`${getCoolString(result1)} - ${getCoolString(result2)}\r`);
  }

  if (result1.length > 7 && result2Length > 7) {
    bothDone = true;
  }
}

process.stdout.write(`${result1} - ${result2.join('')}\n`);
console.log('done');
