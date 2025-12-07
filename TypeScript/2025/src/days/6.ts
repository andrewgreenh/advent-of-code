import { readFile } from "fs/promises";

const inp = await readFile("6.txt", "utf8").then((x) => x.slice(0, -1));

const grid = inp.split("\n").map((line) => line.split(/ +/).filter((x) => x !== ""));
const problems = grid[0]!.map((_, x) => grid.map((_, y) => grid[y]![x]!));

let result = 0;
for (const prob of problems) {
  result += eval(prob.slice(0, -1).join(prob.at(-1)));
}
console.log(result);

const plainGrid = inp.split("\n").map((line) => line.split(""));
const newGrid = plainGrid[0].map((_, x) => plainGrid.map((_, y) => plainGrid[y]![x]!));
const inp2 = newGrid.map((line) => line.join(" ").trimEnd()).join("\n");

const results2 = inp2.split("\n\n").map((block) => {
  const rows = block.split("\n");
  const op = rows[0]!.slice(-1);
  const nums = rows.map((line) => parseInt(line.replaceAll(" ", ""), 10)).filter((x) => !!x);
  return eval(nums.join(op));
});
let result2 = 0;
for (const res of results2) {
  result2 += res;
}

console.log(result2);
