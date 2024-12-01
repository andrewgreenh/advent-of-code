import { InfiniteGrid } from './InfiniteGrid';
import { printGrid } from './ts-it/printGrid';

export class IntCodeComputer {
  public state: {
    inputs: number[];
    pos: number;
    relativeBase: number;
    outputs: number[];
    instructions: number[];
  } = {
    inputs: [],
    pos: 0,
    relativeBase: 0,
    outputs: [],
    instructions: [],
  };

  constructor(
    instructions: number[],
    public onOutput: (n: number) => void = () => {},
  ) {
    this.state.instructions = instructions;
  }

  public addInput(n: number) {
    this.state.inputs.push(n);
    return this;
  }

  private getParam = (paramIndex: number, readIndex = false) => {
    let code = this.state.instructions[this.state.pos];
    let modes = [...code.toString().slice(0, -2)].reverse().map(Number);
    const mode = +modes[paramIndex] || 0;
    const param = this.state.instructions[this.state.pos + paramIndex + 1];
    const resultingIndex = mode === 2 ? this.state.relativeBase + param : param;
    if (!readIndex || mode === 1) return resultingIndex;
    return this.state.instructions[resultingIndex];
  };

  private actionsByOpCode = {
    [Op.Add]: () => {
      let a = this.getParam(0, true);
      let b = this.getParam(1, true);
      let c = this.getParam(2);
      this.state.instructions[c] = a + b;
      this.state.pos += 4;
    },
    [Op.Multiply]: () => {
      let a = this.getParam(0, true);
      let b = this.getParam(1, true);
      let c = this.getParam(2);
      this.state.instructions[c] = a * b;
      this.state.pos += 4;
    },
    [Op.Input]: () => {
      let a = this.getParam(0);
      if (this.state.inputs.length === 0) {
        throw new Error('No input provided!');
      }
      this.state.instructions[a] = this.state.inputs.shift()!;
      this.state.pos += 2;
    },
    [Op.Output]: () => {
      const n = this.getParam(0, true);
      this.state.pos += 2;
      this.state.outputs.push(n);
      this.onOutput(n);
    },
    [Op.JumpIfTrue]: () => {
      let a = this.getParam(0, true);
      let b = this.getParam(1, true);
      if (a !== 0) this.state.pos = b;
      else this.state.pos += 3;
    },
    [Op.JumpIfFalse]: () => {
      let a = this.getParam(0, true);
      let b = this.getParam(1, true);
      if (a === 0) this.state.pos = b;
      else this.state.pos += 3;
    },
    [Op.LessThan]: () => {
      let a = this.getParam(0, true);
      let b = this.getParam(1, true);
      let c = this.getParam(2);
      this.state.instructions[c] = a < b ? 1 : 0;
      this.state.pos += 4;
    },
    [Op.Equals]: () => {
      let a = this.getParam(0, true);
      let b = this.getParam(1, true);
      let c = this.getParam(2);
      this.state.instructions[c] = a === b ? 1 : 0;
      this.state.pos += 4;
    },
    [Op.AdjustRelativeBase]: () => {
      let a = this.getParam(0, true);
      this.state.relativeBase += a;
      this.state.pos += 2;
    },
    [Op.Halt]: () => true,
  };

  public run() {
    let ins = this.state.instructions;

    while (true) {
      let code = ins[this.state.pos];
      let opCode = +code.toString().slice(-2);
      const action = this.actionsByOpCode[opCode];
      if (!action) throw new Error('Unknown opcode: ' + opCode);

      let shouldHalt = action();
      if (shouldHalt) break;
    }
    return this;
  }
}

enum Op {
  Add = 1,
  Multiply = 2,
  Input = 3,
  Output = 4,
  JumpIfTrue = 5,
  JumpIfFalse = 6,
  LessThan = 7,
  Equals = 8,
  AdjustRelativeBase = 9,
  Halt = 99,
}

export class IntCodeScreen {
  public readonly grid = new InfiniteGrid<string, string>(() => ' ');
  public paint(resetBeforePaint = false) {
    if (resetBeforePaint) process.stdout.write('\x1b[2J');
    let grid = this.grid.toGrid();
    let rowCount = grid.length;
    printGrid(this.grid.toGrid(), ' ', '');
  }
}
