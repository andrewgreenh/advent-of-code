const blacklist = require('../getInput')(20, 2016).trim().split('\n')
  .map(line => line.split('-').map(i => +i)).sort((a, b) => a[0] - b[0]);

const result = blacklist.reduce(({ blockedUntil, allowed, first }, [min, max]) => {
  if (min > blockedUntil + 1) allowed += min - (blockedUntil + 1);
  if (first < 0 && min > blockedUntil + 1) first = blockedUntil + 1;
  blockedUntil = Math.max(blockedUntil, max);
  return { blockedUntil, allowed, first };
}, { blockedUntil: 0, allowed: 0, first: -1 });

console.log(result.first, result.allowed);
