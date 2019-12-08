export class IntCodeComputer {
  private inputs: number[] = [];
  private pos = 0;
  public outputs: number[] = [];

  constructor(
    public instructions: number[],
    public onOutput: (n: number) => void = () => {},
  ) {}

  public addInput(n: number) {
    this.inputs.push(n);
    return this;
  }

  private readFromInstructions(n: number, mode: number = 0) {
    if (mode === 1) return n;
    return this.instructions[n];
  }

  public run() {
    let ins = this.instructions;

    while (true) {
      let code = ins[this.pos];
      let opCode = +code.toString().slice(-2);
      let modes = [...code.toString().slice(0, -2)].reverse();
      let read = (n: number) =>
        Array(n)
          .fill(0)
          .map((_, i) =>
            this.readFromInstructions(ins[this.pos + i + 1], +modes[i]),
          );
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
        this.pos += 2;
        this.outputs.push(n);
        this.onOutput(n);
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
    return this;
  }
}
