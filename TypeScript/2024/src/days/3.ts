import { readFile } from "fs/promises";

const inp = await readFile("3.txt", "utf8").then((x) => x.slice(0, -1));

let result1 = 0;
let result2 = 0;
let enabled = true;
const instructions = inp.matchAll(/mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don\'t\(\)/g);
for (const [i, a, b] of instructions) {
  if (i === "do()") enabled = true;
  else if (i === "don't()") enabled = false;
  else {
    result1 += Number(a) * Number(b);
    if (enabled) result2 += Number(a) * Number(b);
  }
}
console.log(result1, result2);
