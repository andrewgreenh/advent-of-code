import { readFile } from "fs/promises";

const inp = await readFile("2.txt", "utf8").then((x) => x.slice(0, -1));

const ranges = inp.split(",").map((r) => r.split("-"));

const isFunky = (x: string, n = 2) => {
  if (x.length % n !== 0) return false;
  for (let i = 0; i < x.length; i += n) {
    if (x.slice(i, i + n) !== x.slice(0, n)) return false;
  }
  return true;
};

const isFunky2 = (x: string) => {
  for (let i = 1; i < x.length; i++) {
    if (isFunky(x, i)) return true;
  }
  return false;
};

let x = 0;
let y = 0;

for (let [start, end] of ranges) {
  for (let i = parseInt(start); i <= parseInt(end); i++) {
    if (isFunky(i.toString())) {
      x += i;
    }
    if (isFunky2(i.toString())) {
      y += i;
    }
  }
}

console.log(x);
console.log(y);
