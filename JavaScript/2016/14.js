const { createHash } = require('crypto');
const _ = require('lodash');
const salt = require('../getInput')(14, 2016).trim();

// const salt = 'abc';
const write = process.stdout.write.bind(process.stdout);
const goodIndices = [];

const getTripple = str => _.get(str.match(/(.)\1{2}/), '0');
const part2 = false;

function getHash(salt, index) {
  const cache = {};
  if (!cache[salt + index]) {
    if (!part2) {
      cache[salt + index] = createHash('md5').update(`${salt}${index}`).digest('hex');
    } else {
      let hash = createHash('md5').update(`${salt}${index}`).digest('hex');
      for (let i = 0; i < 2016; i++) {
        hash = createHash('md5').update(hash).digest('hex');
      }
      cache[salt + index] = hash;
    }
  }
  return cache[salt + index];
}

let index = 0;
while (goodIndices.length < 64) {
  if (index % 1000 === 0) write(`Index: ${index}, good hashes: ${goodIndices.length}\r`);
  const nextHash = getHash(salt, index);
  const tripple = getTripple(nextHash);
  if (_.isNil(tripple)) {
    index++;
    continue;
  }
  let hasGoodComing = false;
  for (let i = index + 1; i < index + 1001; i++) {
    const nextHash = getHash(salt, i);
    const hasFive = _.includes(nextHash, _.repeat(tripple[0], 5));
    if (!hasFive) {
      continue;
    }
    hasGoodComing = true;
    break;
  }
  if (hasGoodComing) {
    goodIndices.push(index);
    index++;
    continue;
  }
  index++;
}

console.log('\n', goodIndices);
