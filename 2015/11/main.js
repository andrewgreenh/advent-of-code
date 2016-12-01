const _ = require('lodash');
const lazy = require('lazy.js');
require('../loadSlide');
var input = require('../getInput')(11).trim();

const
  groups = _.slide("abcdefghijklmnopqrstuvwxyz", 3).map(i => i.join('')),
  incStr = str => (parseInt(str, 36) + 1).toString(36).replace(/0/, 'a'),
  has2Pairs = str => str.match(/(.)\1.*(.)\2/g) !== null,
  containsAny = (s, a) => _.some(a, string => s.indexOf(string) > -1),
  isPw = str => !(str.match(/[iol]/)) && containsAny(str, groups) && has2Pairs(str),
  findPw = str => lazy.generate(createSeqFrom(str)).filter(pw => isPw(pw)).first(),
  result1 = findPw(input),
  result2 = findPw(result1);

console.log(result1, result2);

function createSeqFrom(str) {
  var last = str;
  return (i) => {
    last = incStr(last);
    return last;
  }
}
