const _ = require('lodash');
var input = require('../getInput')(23).trim().split('\n')
  .map(line => line.match(/(-?\w+)/g));

console.log(computeAAndB({a: 0, b: 0}, input));
console.log(computeAAndB({a: 1, b: 0}, input));

function computeAAndB(regs, insts) {
  var inst = insts[0];
  var index = 0;
  while(inst !== undefined) {
    if(inst[0] == 'hlf') regs[inst[1]] = regs[inst[1]] / 2;
    if(inst[0] == 'tpl') regs[inst[1]] = regs[inst[1]] * 3;
    if(inst[0] == 'inc') regs[inst[1]] = regs[inst[1]] + 1;
    
    if(inst[0] == 'jmp') index = index + parseInt(inst[1]);
    else if(inst[0] == 'jie') index = (regs[inst[1]] % 2 == 0) ? index + parseInt(inst[2]) : index + 1;
    else if(inst[0] == 'jio') index = (regs[inst[1]] == 1) ?  index + parseInt(inst[2]) : index + 1;
    else index++;
    inst = insts[index];
  }
  return regs;
}
