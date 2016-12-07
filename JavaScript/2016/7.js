const _ = require('lodash');
require('../loadSlide');
const lines = require('../getInput')(7, 2016).trim().split('\n');

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
  const supernetSequences = s.match(/\[[^[\]]*((.).\1)[^[\]]*]/g);
  if (supernetSequences === null) return false;
  const remaining = _.reduce(supernetSequences, (agg, seq) => agg.replace(seq, ''), s);
  let abas = matchOverlap(remaining, /(.).\1/g);
  if (abas === null) return false;
  abas = _.reject(abas, ([a, b, c]) => a === b);
  if (_.isEmpty(abas)) return false;
  const expectedBabs = _.map(abas, ([a, b, c]) => `${b}${a}${b}`);
  const hasMatching = _.some(supernetSequences, actualBab =>
    _.some(expectedBabs, expectedBab =>
      _.includes(actualBab, expectedBab)));
  if (!hasMatching) return false;
  return true;
};

console.log(lines.filter(isIp).length, lines.filter(hasSSL).length);

function matchOverlap(input, re) {
  const r = [];
  let m;
  if (!re.global) {
    re = new RegExp(re.source, (re + '').split('/').pop() + 'g');
  }
  // eslint-disable-next-line
  while (m = re.exec(input)) {
    re.lastIndex -= m[0].length - 1;
    r.push(m[0]);
  }
  return r;
}
