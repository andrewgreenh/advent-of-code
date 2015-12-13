var _ = require('lodash');
var input = require('../getInput')(13).trim().split('\n');
var permutate = require('../permutate');
require('../loadSlide');

const dic = _.reduce(input, parseLine, {});
console.log(calcHappiness(dic, false), calcHappiness(dic, true));

function calcHappiness(dic, youToo) {
  return _(youToo ? withYou(dic) : dic)
    .keys().map(i => i.split(',')).flatten().uniq()
    .permute()
    .map(perm => _(perm)
      .concat(_.first(perm))
      .slide(2)
      .map(([x,y]) => {var [a,b] = [x,y].sort(); return dic[a+','+b]})
      .sum())
    .max();
}

function parseLine(agg, str) {
  var [,p1,LorW, amount, p2] = str.match(/(\w*) \w* (\w*) (\d*).*?(\w+)\.$/);
  amount = parseInt(amount);
  if(LorW === 'lose') amount *= -1;
  var [p1, p2] = [p1, p2].sort();
  agg[p1+','+p2] = agg[p1+','+p2] + amount || amount;
  return agg;
}

function withYou(obj) {
  return _.assign(obj,
    _(obj).keys().map(i => i.split(',')).flatten().uniq()
    .map(p => p+',you').reduce((agg, i) => _.set(agg, i, 0), {}));
}
