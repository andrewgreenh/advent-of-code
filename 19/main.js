const _ = require('lodash');
var input = _.compact(require('../getInput')(19).trim().split('\n'));
var medicine = input.pop();
var result1 = _(input).map(transition => {
  var [from, to] = transition.split(' => ');
  return replacePossibilities(medicine, from, to);
}).flatten().uniq().value();
var result2 = computeDistanceToE(medicine, input);
console.log(result1.length, result2);

function replacePossibilities(haystack, needle, replace) {
  var rest = haystack;
  var results = [];
  var front = '';
  while(rest.indexOf(needle) > -1) {
    var index = rest.indexOf(needle);
    front += rest.substring(0, index);
    var back = rest.substring(index+needle.length);
    results.push(front + replace + back);
    rest = back;
    front += needle;
  }
  return results;
}

function computeDistanceToE(medicine, input) {
  var rest = medicine;
  var count = 0;
  var loop = true;
  while(loop) {
    var best = input.reduce((longest, trans) => {
      var [from, to] = trans.split(' => ');
      if(to.length < longest.to.length) return longest;
      if(rest.indexOf(to) > -1) return {to, from};
      return longest;
    }, {from: '', to: ''});
    var newRest = rest.replace(best.to, best.from);
    if(newRest == rest) break;
    count++;
    rest = newRest;
  }
  return count;
}
