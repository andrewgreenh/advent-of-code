const _ = require('lodash');
var input = require('../getInput')(20);
const max = 1000000;

function compute(input, max, part1) {
  var houses = _.range(0, max, 0);
  for(var elf = 1; elf < max; elf++) {
    if(part1) {
      for(var visit = elf; visit < max; visit+=elf) {
        houses[visit] += elf * 10;
      }
    } else {
      for(var visit = elf; visit <= elf * 50 && elf < max; visit+=elf) {
        houses[visit] += elf * 11;
      }
    }
  }
  houses.shift();
  return _(houses).takeWhile(e => e < input).value().length + 1;
}

console.log(compute(input, max, true));
console.log(compute(input, max, false));
