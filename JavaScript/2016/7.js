const _ = require('lodash');
require('../loadSlide');
const lines = require('../getInput')(7, 2016).trim().split('\n');

const test = 'zazbz[bzb]cdb';

const isIp = s => {
  let abbas = s.match(/(.)(.)\2\1/g);
  if (abbas === null) return false;
  abbas = _.reject(abbas, ([a, b, c, d]) => a === b);
  const badAbbas = s.match(/\[[^[\]]*(.)(.)\2\1[^[\]]*]/g);
  if (badAbbas !== null) return false;
  if (_.isNull(abbas) || _.isEmpty(abbas)) return false;
  return true;
};

const hasSSL = s => {
  let abas = s.match(/(?=(.).\1)/g);
  console.log(abas);
  if (abas === null) return false;
  abas = _.reject(abas, ([a, b, c]) => a === b);
  const actualBabs = s.match(/\[[^[\]]*(.).\1[^[\]]*]/g);
  const expectedBabs = _.map(abas, ([a, b, c]) => `${b}${a}${b}`);
  const hasMatching = _.some(actualBabs, actualBab => _.some(expectedBabs, expectedBab => _.includes(actualBab, expectedBab)));
  console.log(abas, actualBabs, expectedBabs);
  if (!hasMatching) return false;
  return true;
};

console.log(hasSSL(test));
