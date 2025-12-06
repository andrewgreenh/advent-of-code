import { readFile } from "fs/promises";

const inp = await readFile("1.txt", "utf8").then((x) => x.slice(0, -1));

let current = 50;
let p1 = 0;
let p2 = 0;
for (const line of inp.split("\n")) {
  const dir = line[0];
  const value = parseInt(line.slice(1), 10);

  const factor = dir === "R" ? 1 : -1;
  for (let i = 0; i < value; i++) {
    current += factor;
    if (current % 100 === 0) {
      p2++;
    }
  }
  if (current % 100 === 0) {
    p1++;
  }
}
console.log(p1);
console.log(p2);
