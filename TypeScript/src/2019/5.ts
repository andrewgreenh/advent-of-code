import getInput from '../lib/getInput';
import { numbers } from '../lib/ts-it/numbers';

const input = getInput(5, 2019);
const instructions = numbers(input);

run([...instructions], [1]);
run([...instructions], [5]);

function run(instructions: number[], inputs: number[]) {
  let ins = instructions;
  let readWithMode = (n: number, mode: number = 0) =>
    mode === 1 ? n : instructions[n];
  let outputs: number[] = [];
  let p = 0;

  while (true) {
    let code = ins[p];
    let opCode = +code.toString().slice(-2);
    let modes = [...code.toString().slice(0, -2)].reverse();
    let read = (n: number) =>
      Array(n)
        .fill(0)
        .map((_, i) => readWithMode(ins[p + i + 1], +modes[i]));
    if (opCode === 1) {
      let [a, b] = read(2);
      ins[ins[p + 3]] = a + b;
      p += 4;
    } else if (opCode === 2) {
      let [a, b] = read(2);
      ins[ins[p + 3]] = a * b;
      p += 4;
    } else if (opCode === 3) {
      ins[ins[p + 1]] = inputs.shift()!;
      p += 2;
    } else if (opCode === 4) {
      outputs.push(read(1)[0]);
      p += 2;
    } else if (opCode === 5) {
      let [a, b] = read(2);
      if (a !== 0) p = b;
      else p += 3;
    } else if (opCode === 6) {
      let [a, b] = read(2);
      if (a === 0) p = b;
      else p += 3;
    } else if (opCode === 7) {
      let [a, b] = read(2);
      ins[ins[p + 3]] = a < b ? 1 : 0;
      p += 4;
    } else if (opCode === 8) {
      let [a, b] = read(2);
      ins[ins[p + 3]] = a === b ? 1 : 0;
      p += 4;
    } else if (opCode === 99) {
      break;
    } else {
      throw new Error('Unknown opcode: ' + opCode);
    }
  }

  console.log(outputs);
}
