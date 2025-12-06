import { readFile } from "fs/promises";

const inp = await readFile("3.txt", "utf8").then((x) => x.slice(0, -1));

function getJoltage(line: string, n: number) {
  let nums = [] as number[];
  let lastIndex = -1;
  for (let i = 0; i < n; i++) {
    const nextNum = Math.max(...(line.slice(lastIndex + 1, -1 * (n - i - 1) || undefined) as any));
    const nextIndex = line.indexOf(nextNum.toString(), lastIndex + 1);
    nums.push(nextNum);
    lastIndex = nextIndex;
  }

  return Number(nums.join(""));
}

let result = 0;
let result2 = 0;
for (const line of inp.split("\n")) {
  result += getJoltage(line, 2);
  result2 += getJoltage(line, 12);
}
console.log(result);
console.log(result2);
