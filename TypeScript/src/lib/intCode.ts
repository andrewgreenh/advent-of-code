export type IntCodeInstruction = (n: number[], index: number) => number;
export type IntCodeInstructions = ObjectOf<IntCodeInstruction>;

export function intCode(
  input: number[],
  instructions: ObjectOf<IntCodeInstruction>,
  start = 0,
) {
  let ins = { ...baseInstructions, ...instructions };
  let p = start;
  while (true) {
    p = ins[input[p]](input, p);
    if (p < 0) break;
  }
  return input;
}

let baseInstructions: IntCodeInstructions = {
  1: (n, index) => {
    let a = n[index + 1];
    let b = n[index + 2];
    let c = n[index + 3];
    n[c] = n[a] + n[b];
    return index + 4;
  },
  2: (n, index) => {
    let a = n[index + 1];
    let b = n[index + 2];
    let c = n[index + 3];
    n[c] = n[a] * n[b];
    return index + 4;
  },
  99: () => -1,
};
