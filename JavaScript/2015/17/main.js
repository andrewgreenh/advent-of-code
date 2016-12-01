const _ = require('lodash');
var input = require('../getInput')(17).trim().split('\n').map(_.ary(parseInt, 1)).sort((a,b) => a-b);

Array.prototype.combinate = function( iItems, aIn ) {
    if (!aIn) {
        var aIn = new Array();
        this.combinate.aResult = new Array();
    }
    for(var i = 0; i < this.length; i++) {
        var a = aIn.concat(this[i]);
        var aRest = this.concat(); // Concat with nothing to create copy
        aRest.splice(0, i + 1);

        if(iItems && iItems - 1 <= aRest.length) {
            aRest.combinate(iItems - 1, a);
            if(iItems == 1) this.combinate.aResult.push(a);
        }
    }
    return this.combinate.aResult;
}

const goal = 150;
const maxCount =
  _.takeWhile(input, (e, idx, arr) => _(arr).take(idx+1).sum() <= goal).length;
const minCount =
  _.takeRightWhile(input, (e, idx, arr) => _(arr).takeRight(arr.length - idx).sum() <= goal).length + 1;
const calc = arrayOfCounts => _(arrayOfCounts)
  .map(i => input.combinate(i))
  .flatten()
  .filter(combination => _.sum(combination) === goal)
  .value()
  .length;
var result1 = calc(_.range(minCount, maxCount + 1));
var result2 = calc([minCount]);
console.log(result1, result2);
