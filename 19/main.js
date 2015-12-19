const _ = require('lodash');
var input = _.compact(require('../getInput')(19).trim().split('\n'));
var medicine = input.pop();
var transitions = input.map(line => ({
  from: line.split(' => ')[0],
  to: line.split(' => ')[1]
}));
var result1 = _(transitions)
  .map(({from, to}) => replacePossibilities(medicine, from, to))
  .flatten().uniq()
  .value();
var result2 = computeDistanceToE(medicine, input);
console.log(result1.length, result2);

function replacePossibilities(haystack, needle, replace) {
  var rest = haystack;
  var results = [];
  var front = '';
  while(rest.includes(needle)) {
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
  var steps = 0;
  var restIsGettingSmaller = true;
  while(restIsGettingSmaller) {
    var bestTransition = input.reduce((longest, trans) => {
      var [from, to] = trans.split(' => ');
      if(to.length < longest.to.length) return longest;
      if(rest.includes(to)) return {to, from};
      return longest;
    }, {from: '', to: ''});
    var newRest = rest.replace(bestTransition.to, bestTransition.from);
    if(newRest == rest) break;
    steps++;
    rest = newRest;
  }
  return steps;
}
