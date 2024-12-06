import { readFile } from "fs/promises";

const inp = await readFile("5.txt", "utf8").then((x) => x.slice(0, -1));

const [rules, updates] = inp
  .trim()
  .split("\n\n")
  .map((x) => x.split("\n"));

const children = new Map<number, number[]>();
for (const line of rules) {
  const [a, b] = line.match(/\d+/g)!.map(Number);
  if (!children.has(a)) children.set(a, []);
  children.get(a)!.push(b);
}

let result1 = 0;
let result2 = 0;
for (const update of updates) {
  const nums = update.match(/\d+/g)!.map(Number);
  const sorted = nums.toSorted((a, b) =>
    children.get(a)?.includes(b) ? -1 : children.get(b)?.includes(b) ? 1 : 0
  );
  if (nums.join(",") === sorted.join(",")) {
    result1 += nums[Math.floor(nums.length / 2)]!;
  } else {
    result2 += sorted[Math.floor(sorted.length / 2)]!;
  }
}
console.log(result1, result2);
