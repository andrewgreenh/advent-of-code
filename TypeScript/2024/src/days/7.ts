import { readFile } from "fs/promises";

const inp = await readFile("7.txt", "utf8").then((x) => x.slice(0, -1));

type Op = (a: number, b: number) => number;
const ops1: Array<Op> = [(a, b) => a * b, (a, b) => a + b];
const ops2 = [...ops1, (a: number, b: number) => Number(String(a) + String(b))];

let result1 = 0;
let result2 = 0;
for (const line of inp.trim().split("\n")) {
  const [num, ...rest] = line.match(/(\d+)/g)!.map(Number);
  if (findMatch(num, rest[0], ops1, rest.slice(1))) result1 += num;
  if (findMatch(num, rest[0], ops2, rest.slice(1))) result2 += num;
}
console.log(result1, result2);

function findMatch(target: number, current: number, ops: Op[], rest: number[]): boolean {
  if (current === target && rest.length === 0) return true;
  if (current > target || rest.length === 0) return false;
  for (const op of ops) {
    if (findMatch(target, op(current, rest[0]!), ops, rest.slice(1))) return true;
  }
  return false;
}
