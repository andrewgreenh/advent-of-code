const input = require('../getInput')(2).trim().split('\n');
const _ = require('lodash');

var result1 = _(input).map(row => {
  var v = row.split('x').sort((a,b) => a-b);
  return 2*(v[0]*v[1] + v[0]*v[2] + v[1]*v[2]) + v[0]*v[1];
}).sum();

var result2 = _(input).map(row => {
  var v = row.split('x').sort((a,b) => a-b);
  return 2*v[0] + 2*v[1] + v[0]*v[1]*v[2];
}).sum();

console.log(result1, result2);
