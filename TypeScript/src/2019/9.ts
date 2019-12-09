import getInput from '../lib/getInput';
import { IntCodeComputer } from '../lib/intCode';
import { numbers } from '../lib/ts-it/numbers';

const input = getInput(9, 2019);
const data = numbers(input);

const a = new IntCodeComputer([...data]).addInput(1).run();
console.log(a.outputs);
const b = new IntCodeComputer([...data]).addInput(2).run();
console.log(b.outputs);
