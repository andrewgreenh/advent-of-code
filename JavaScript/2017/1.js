const input = require('../getInput')(1, 2017).trim();

const result = offset => numberString =>
  numberString
    .split('')
    .filter((val, index, arr) => val === arr[(index + offset) % arr.length])
    .reduce((a, b) => a + +b, 0);

console.log(result(1)(input));
console.log(result(input.length / 2)(input));
