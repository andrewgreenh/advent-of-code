import getInput from '../lib/getInput';
import { numbers } from '../lib/ts-it/numbers';

const input = getInput(5, 2019);
const instructions = numbers(input);

class IntCodeComputer {
  private inputs: number[] = [];
  private pos = 0;
  public outputs: number[] = [];

  constructor(
    public instructions: number[],
    public onOutput: (n: number) => void = () => {},
  ) {}

  public addInput(n: number) {
    this.inputs.push(n);
  }

  public run() {
    let ins = this.instructions;
    let readWithMode = (n: number, mode: number = 0) =>
      mode === 1 ? n : ins[n];
    while (true) {
      let code = ins[this.pos];
      let opCode = +code.toString().slice(-2);
      let modes = [...code.toString().slice(0, -2)].reverse();
      let read = (n: number) =>
        Array(n)
          .fill(0)
          .map((_, i) => readWithMode(ins[this.pos + i + 1], +modes[i]));
      if (opCode === 1) {
        let [a, b] = read(2);
        ins[ins[this.pos + 3]] = a + b;
        this.pos += 4;
      } else if (opCode === 2) {
        let [a, b] = read(2);
        ins[ins[this.pos + 3]] = a * b;
        this.pos += 4;
      } else if (opCode === 3) {
        ins[ins[this.pos + 1]] = this.inputs.shift()!;
        this.pos += 2;
      } else if (opCode === 4) {
        const n = read(1)[0];
        this.outputs.push(n);
        this.pos += 2;
      } else if (opCode === 5) {
        let [a, b] = read(2);
        if (a !== 0) this.pos = b;
        else this.pos += 3;
      } else if (opCode === 6) {
        let [a, b] = read(2);
        if (a === 0) this.pos = b;
        else this.pos += 3;
      } else if (opCode === 7) {
        let [a, b] = read(2);
        ins[ins[this.pos + 3]] = a < b ? 1 : 0;
        this.pos += 4;
      } else if (opCode === 8) {
        let [a, b] = read(2);
        ins[ins[this.pos + 3]] = a === b ? 1 : 0;
        this.pos += 4;
      } else if (opCode === 99) {
        break;
      } else {
        throw new Error('Unknown opcode: ' + opCode);
      }
    }
  }
}

let a = new IntCodeComputer([...instructions]);
a.addInput(1);
a.run();
console.log(a.outputs);

let b = new IntCodeComputer([...instructions]);
b.addInput(5);
b.run();
console.log(b.outputs);
