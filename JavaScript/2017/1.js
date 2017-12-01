const _ = require('lodash');
const input = require('../getInput')(1, 2017).trim();

const result = offset => input =>
  _(input.split(''))
    .map((val, index, arr) => (+val === +arr[(index + offset) % arr.length] ? +val : 0))
    .sum();

console.log(result(1)(input));
console.log(result(input.length / 2)(input));
