const _ = require('lodash');
require('../loadSlide');
const lines = require('../getInput')(7, 2016).trim().split('\n');

// Returns 2 strings for each line: One for the supernet sequence one for the hypernet sequence
const parse = line => {
  const parts = line.split(/\[([^[\]]+)]/);
  return parts
    .reduce(([arr1, arr2], item, index) =>
      (index % 2 === 0 ? [[...arr1, item], arr2] : [arr1, [...arr2, item]]),
      [[], []]
    ).map(i => i.join(' - '));
};

const ips = lines.map(parse);
const hasAbba = s => {
  const z = _.zip(s.split(''), s.slice(1).split(''), s.slice(2).split(''), s.slice(3).split(''));
  return _.some(z, ([a, b, c, d]) => a !== b && a === d && b === c);
};
const canTLS = ([sn, hn]) => hasAbba(sn) && !hasAbba(hn);
const canSSL = ([sn, hn]) => {
  const z = _.zip(sn.split(''), sn.slice(1).split(''), sn.slice(2).split(''));
  return _.some(z, ([a, b, c]) => a === c && a !== b && _.includes(hn, b + a + b));
};

console.log(ips.filter(canTLS).length);
console.log(ips.filter(canSSL).length);
