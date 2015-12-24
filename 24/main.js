const _ = require('lodash');
var input = require('../getInput')(24).trim().split('\n').map(_.ary(parseInt, 1));


const weightGoal =_.sum(input) / 4;

var possibilities = getCombinations(input, weightGoal, []).sort((a,b) => a.length - b.length);
var smallestAmmount = _(possibilities).dropWhile(p =>
  getCombinations(_.without(input, ...p), weightGoal, []) === undefined).first().length;
var result = _(possibilities)
  .filter(p => p.length == smallestAmmount)
  .filter((p, i, arr) => {
    process.stdout.write(Math.round((i / arr.length).toFixed(2) * 100) + '%\r');
    return getCombinations(_.without(input, ...p), weightGoal, []) !== undefined;
  })
  .min(p => p.reduce((a, i) => a*i));
console.log(result.reduce((a, i) => a*i));

function getCombinations(array, goal, chosen) {
  if(goal < 1 ||
     _.min(array) > goal ||
     _.sum(array) < goal ||
     array[0] == undefined)
     return undefined;
  var next = array[0];
  var rest = _.rest(array);
  if(next == goal) return [chosen.concat([next])];
  var combsWithNext = getCombinations(rest, goal - next, chosen.concat([next]));
  var combsWithoutNext = getCombinations(rest, goal, chosen);
  if(combsWithNext === undefined) {
    return combsWithoutNext;
  }
  if(combsWithoutNext === undefined) {
    return combsWithNext;
  }
  return combsWithoutNext.concat(combsWithNext);
}
