const _ = require('lodash');
var [y, x] = require('../getInput')(25).match(/(\d+)/g).map(_.ary(parseInt, 1));
const lazy = require('lazy.js');
const seq = lazy.generate(() => {
  var next = 20151125;
  return () => {
    var current = next;
    next = current * 252533 % 33554393;
    return current;
  };
}());

console.log(getCodeFromYAndX(y, x));

function getCodeFromYAndX(y, x) {
  return seq.take(getNumber(y, x)).last();
}

function getNumber(y, x) {
  var result = 1;
  for(var i = 1; i < y; i++) {
    result += i;
  }
  for(var i = 1; i < x; i++) {
    result += i + y;
  }
  return result;
}
