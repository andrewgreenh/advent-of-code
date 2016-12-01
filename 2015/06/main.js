const _ = require('lodash');
require('../loadScan');
var input = require('../getInput')(6).trim().split('\n');

var result = _(input).chain()
  .reduce(resolveFunction, _.range(0, 1000).map(i => _.range(0, 1000).map(e => 0)))
  .flatten()
  .reduce((a,b) => a+b)
  .value();

console.log(result);


function  resolveFunction(agg, str) {
  var pattern = /(\d+),(\d+)[^\d]+(\d+),(\d+)/
  var [, x1, y1, x2, y2] = str.match(pattern).map(_.ary(parseInt, 1));
  if(str.match(/off/)) return turnOff(agg, [x1, y1], [x2, y2]);
  if(str.match(/on/)) return turnOn(agg, [x1, y1], [x2, y2]);
  if(str.match(/toggle/)) return toggle(agg, [x1, y1], [x2, y2]);
}

function turnOn(array, [x1, y1], [x2, y2]) {
  for (var i = x1; i <= x2; i++) {
    for (var j = y1; j <= y2; j++) {
      array[i][j] = array[i][j] + 1;
    }
  }
  return array;
}

function turnOff(array, [x1, y1], [x2, y2]) {
  for (var i = x1; i <= x2; i++) {
    for (var j = y1; j <= y2; j++) {
      if(array[i][j] > 0) {
        array[i][j] = array[i][j] - 1;
      }
    }
  }
  return array;
}

function toggle(array, [x1, y1], [x2, y2]) {
  for (var i = x1; i <= x2; i++) {
    for (var j = y1; j <= y2; j++) {
      array[i][j] = array[i][j] + 2;
    }
  }
  return array;
}
