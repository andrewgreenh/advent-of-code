const _ = require('lodash');
const lines = require('../getInput')('23_alt', 2016).trim().split('\n');

const toCommand = line => {
  const [command, ...rest] = line.split(' ');
  return { command, args: rest };
};
const commands = lines.map(toCommand);

function toThunk({ command, args }) {
  const thunkGettersByCommand = {
    add: ([reg, a, b]) => state => {
      // console.log('add', get(state, a), get(state, b));
      state.registers[reg] += get(state, a) * get(state, b);
      state.index++;
    },
    cpy: ([value, reg]) => state => {
      if (_.isNaN(+reg)) state.registers[reg] = get(state, value);
      state.index++;
    },
    inc: ([reg]) => state => { state.index++; state.registers[reg]++; },
    dec: ([reg]) => state => { state.index++; state.registers[reg]--; },
    jnz: ([check, jump]) => state => {
      if (get(state, check) !== 0) state.index += get(state, jump) - 1;
      state.index++;
    },
    tgl: ([value]) => state => {
      toggleCommand(state.commands, state.index + get(state, value));
      state.index++;
    },
  };
  return thunkGettersByCommand[command](args);
}

function get(state, x) {
  if (_.isNaN(+x)) return state.registers[x];
  return +x;
}

function toggleCommand(commands, index) {
  if (index >= commands.length || index < 0) return;
  const mapping = {
    cpy: 'jnz',
    inc: 'dec',
    dec: 'inc',
    jnz: 'cpy',
    tgl: 'inc',
  };
  commands[index].command = mapping[commands[index].command];
}

function getResult(state) {
  while (state.index >= 0 && state.index < state.commands.length) {
    // console.log(state.commands[state.index]);
    toThunk(state.commands[state.index])(state);
    // console.log(state.registers);
    // console.log(state.index);
  }
  return state;
}

console.log(
  getResult({ index: 0, registers: { a: 12, b: 0, c: 0, d: 0 }, commands })
);
