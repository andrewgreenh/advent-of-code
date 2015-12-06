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
  var matches = str.match(pattern);
  var first = [parseInt(matches[1]), parseInt(matches[2])];
  var to = [parseInt(matches[3]), parseInt(matches[4])];
  if(str.match(/off/) !== null) {
    return turnOff(agg, first, to);
  } else if(str.match(/on/) !== null) {
    return turnOn(agg, first, to);
  } else if(str.match(/toggle/) !== null) {
    return toggle(agg, first, to);
  }
}

function turnOn(array, coord1, coord2) {
  for (var i = coord1[0]; i <= coord2[0]; i++) {
    for (var j = coord1[1]; j <= coord2[1]; j++) {
      array[i][j] = array[i][j] + 1;
    }
  }
  return array;
}

function turnOff(array, coord1, coord2) {
  for (var i = coord1[0]; i <= coord2[0]; i++) {
    for (var j = coord1[1]; j <= coord2[1]; j++) {
      if(array[i][j] > 0) {
        array[i][j] = array[i][j] - 1;
      }
    }
  }
  return array;
}

function toggle(array, coord1, coord2) {
  for (var i = coord1[0]; i <= coord2[0]; i++) {
    for (var j = coord1[1]; j <= coord2[1]; j++) {
      array[i][j] = array[i][j] + 2;
    }
  }
  return array;
}
