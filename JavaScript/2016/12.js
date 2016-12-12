const _ = require('lodash');
const thunks = require('../getInput')(12, 2016).trim().split('\n').map(toThunk);

function getResult(thunks, state) {
  while (state.index >= 0 && state.index < thunks.length) thunks[state.index](state);
  return state;
}

function toThunk(instruction) {
  const [command, ...rest] = instruction.split(' ');
  const thunkGettersByCommand = {
    cpy: ([value, reg]) => (_.isNaN(+value) ?
      state => { state.index++; state.registers[reg] = state.registers[value]; } :
      state => { state.index++; state.registers[reg] = +value; }),
    inc: ([reg]) => state => { state.index++; state.registers[reg]++; },
    dec: ([reg]) => state => { state.index++; state.registers[reg]--; },
    jnz: ([check, jump]) => (_.isNaN(+check) ?
      state => { if (state.registers[check] !== 0) state.index += jump - 1; state.index++; } :
      state => { if (check !== 0) state.index += jump - 1; state.index++; }),
  };
  return thunkGettersByCommand[command](rest);
}

console.time('result');
console.log(getResult(thunks, { index: 0, registers: { a: 0, b: 0, c: 0, d: 0 } }));
console.log(getResult(thunks, { index: 0, registers: { a: 0, b: 0, c: 1, d: 0 } }));
console.timeEnd('result');
