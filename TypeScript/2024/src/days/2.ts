import { readFile } from "fs/promises";

const inp = await readFile("2.txt", "utf8").then((x) => x.slice(0, -1));

function isSafe(arr: number[]): boolean {
  return (
    arr.every((n, i, a) => i === 0 || (n > a[i - 1] && n - a[i - 1] <= 3)) ||
    arr.every((n, i, a) => i === 0 || (n < a[i - 1] && a[i - 1] - n <= 3))
  );
}

let result1 = 0;
let result2 = 0;
for (const line of inp.split("\n")) {
  const nums = [...line.matchAll(/(\d+)/g)].map((x) => +x[0]);
  if (isSafe(nums)) result1++;
  for (let i = 0; i < nums.length; i++) {
    if (isSafe(nums.filter((_, j) => j !== i))) {
      result2++;
      break;
    }
  }
}
console.log(result1);
console.log(result2);
