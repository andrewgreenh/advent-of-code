import { readFile } from "fs/promises";

const inp = await readFile("5.txt", "utf8").then((x) => x.slice(0, -1));

const [rangesPart, ingredientsPart] = inp.split("\n\n");

const ranges = rangesPart
  .split("\n")
  .map((line) => line.split("-").map((x) => +x) as [number, number]);
const ingredients = ingredientsPart.split("\n").map((x) => +x);

let result1 = 0;

for (const ingredient of ingredients) {
  for (const [min, max] of ranges) {
    if (ingredient >= min && ingredient <= max) {
      result1++;
      break;
    }
  }
}

console.log(result1);

function overlaps(r1: [number, number], r2: [number, number]) {
  return r1[0] <= r2[1] && r2[0] <= r1[1];
}

function merge(r1: [number, number], r2: [number, number]): [number, number] {
  return [Math.min(r1[0], r2[0]), Math.max(r1[1], r2[1])];
}

let compacted = true;
while (compacted) {
  compacted = false;
  for (let i = 0; i < ranges.length - 1; i++) {
    for (let j = i + 1; j < ranges.length; j++) {
      if (overlaps(ranges[i]!, ranges[j])) {
        ranges[i] = merge(ranges[i], ranges[j]);
        ranges.splice(j, 1);
        compacted = true;
        break;
      }
    }
  }
}

let result2 = 0;
for (const [min, max] of ranges) {
  result2 += max - min + 1;
}

console.log(result2);
