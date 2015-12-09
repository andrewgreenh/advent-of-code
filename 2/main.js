const input = require('../getInput')(2).trim().split('\n');
const _ = require('lodash');

var result1 = _(input).map(row => {
  var [a,b,c] = row.split('x').sort((a,b) => a-b);
  return 2*(a*b + a*c + b*c) + a*b;
}).sum();

var result2 = _(input).map(row => {
  var [a,b,c] = row.split('x').sort((a,b) => a-b);
  return 2*a + 2*b + a*b*c;
}).sum();

console.log(result1, result2);
