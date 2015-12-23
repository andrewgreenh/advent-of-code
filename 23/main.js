const _ = require('lodash');
var input = require('../getInput')(23).trim().split('\n')
  .map(line => line.match(/(-?\w+)/g));

console.log(computeAAndB(0, 0, input));
console.log(computeAAndB(1, 0, input));

function computeAAndB(a, b, instructions) {
  var instruction = instructions[0];
  var index = 0;
  while(instruction !== undefined) {
    var [a,b] = computeRegisters(a,b, instruction);
    index = getNextIndex(a, b, index, instruction);
    if(index > input.length || index < 0) break;
    instruction = instructions[index];
  }
  return [a, b];
}

function computeRegisters(a, b, instruction) {
  if(instruction[0] == 'hlf') {
    return instruction[1] == 'a' ? [a / 2, b] : [a, b / 2];
  }
  if(instruction[0] == 'tpl') {
    return instruction[1] == 'a' ? [a * 3, b] : [a, b * 3];
  }
  if(instruction[0] == 'inc') {
    return instruction[1] == 'a' ? [a+1, b] : [a, b+1];
  }
  return [a,b];
}

function getNextIndex(a, b, index, instruction) {
  if(instruction[0] == 'jmp') {
    return index + parseInt(instruction[1]);
  }
  if(instruction[0] == 'jie') {
    var reg = instruction[1];
    if(reg == 'a') {
      return a % 2 == 0 ? index + parseInt(instruction[2]) : index + 1;
    }
    return b % 2 == 0 ? index + parseInt(instruction[2]) : index + 1;
  }
  if(instruction[0] == 'jio') {
    var reg = instruction[1];
    if(reg == 'a') {
      return a === 1 ? index + parseInt(instruction[2]) : index + 1;
    }
    return b === 0 ? index + parseInt(instruction[2]) : index + 1;
  }
  return index + 1;
}
