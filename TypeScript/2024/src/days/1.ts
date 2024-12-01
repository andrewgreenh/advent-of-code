import { readFile } from "fs/promises";

const inp = await readFile("1.txt", "utf8").then((x) => x.slice(0, -1));

const left = [] as number[];
const right = [] as number[];
for (const line of inp.split("\n")) {
  const [a, b] = line.match(/(\d+)/g)!.map(Number);
  left.push(a);
  right.push(b);
}

left.sort((a, b) => a - b);
right.sort((a, b) => a - b);

let result = 0;
for (let i = 0; i < left.length; i++) {
  result += Math.abs(left[i] - right[i]);
}
console.log(result);

const rightCounts = Object.groupBy(right, (x) => x);

let result2 = 0;
for (const l of left) {
  result2 += l * (rightCounts[l]?.length ?? 0);
}
console.log(result2);
