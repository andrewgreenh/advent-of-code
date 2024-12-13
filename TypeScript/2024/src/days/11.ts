import { readFile } from "fs/promises";

const inp = await readFile("11.txt", "utf8").then((x) => x.slice(0, -1));

const nums = inp.split(" ").map((x) => BigInt(x));

const numMap = new Map<bigint, bigint>();
for (let num of nums) {
  numMap.set(num, (numMap.get(num) ?? 0n) + 1n);
}

for (let i = 0; i < 75; i++) {
  for (const [num, count] of [...numMap.entries()]) {
    const newNums = transformNum(num);
    const newCount = (numMap.get(num) ?? count) - count;
    numMap.set(num, newCount);
    for (const newNum of newNums) {
      numMap.set(newNum, (numMap.get(newNum) ?? 0n) + count);
    }
  }
  if (i === 25 || i === 75) {
    let result = 0n;
    for (const [num, count] of numMap.entries()) {
      result += count;
    }
    console.log(result);
  }
}

let result1 = 0n;
for (const [num, count] of numMap.entries()) {
  result1 += count;
}
console.log(result1);

function transformNum(num: bigint): bigint[] {
  if (num === 0n) return [1n];

  const numString = String(num);
  if (numString.length % 2 === 0) {
    return [
      BigInt(numString.slice(0, numString.length / 2)),
      BigInt(numString.slice(numString.length / 2)),
    ];
  }

  return [num * 2024n];
}
