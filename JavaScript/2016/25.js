const _ = require('lodash');
const thunks = require('../getInput')('25', 2016).trim().split('\n').map(toThunk);

function toThunk(instruction) {
  const [command, ...rest] = instruction.split(' ');
  const thunkGettersByCommand = {
    cpy: ([value, reg]) => state => {
      state.index++; state.registers[reg] = get(state, value);
    },
    inc: ([reg]) => state => { state.index++; state.registers[reg]++; },
    dec: ([reg]) => state => { state.index++; state.registers[reg]--; },
    jnz: ([check, jump]) => state => {
      if (get(state, check) !== 0) state.index += jump - 1; state.index++;
    },
    out: ([reg]) => {
      const handler = getHandler();
      return state => { state.index++; return handler(get(state, reg)); };
    },
    add: ([reg, a, b]) => state => {
      state.registers[reg] += get(state, a) * get(state, b);
      state.index++;
    },
  };
  return thunkGettersByCommand[command](rest);
}

function getHandler() {
  let last = 1;
  return x => {
    if (x === last) {
      last = 1;
      return true;
    }
    last = x;
    return null;
  };
}

function get(state, x) {
  if (_.isNaN(+x)) return state.registers[x];
  return +x;
}

function getResult(thunks, state) {
  let lastStart = _.now();
  let a = 0;
  state.registers.a = a;
  while (state.index >= 0 && state.index < thunks.length) {
    const now = _.now();
    if (now - lastStart > 5000) break;
    const stop = thunks[state.index](state);
    if (stop) {
      // if (a % 1000 === 0) console.log(`Its not ${a}`, state);
      lastStart = _.now();
      state.index = 0;
      a++;
      state.registers.a = a;
      state.registers.b = 0;
      state.registers.c = 0;
      state.registers.d = 0;
    }
  }
  return a;
}


console.log(getResult(thunks, { index: 0, registers: { a: 0, b: 0, c: 0, d: 0 } }));
