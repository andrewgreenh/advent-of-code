import { readFile } from "fs/promises";

const inp = await readFile("9.txt", "utf8").then((x) => x.slice(0, -1));

const buffer: Array<number | null> = [];
let isBlock = true;
let blockIndex = 0;
for (const char of inp) {
  if (isBlock) {
    for (let i = 0; i < +char; i++) buffer.push(blockIndex);
    blockIndex++;
  } else {
    for (let i = 0; i < +char; i++) buffer.push(null);
  }
  isBlock = !isBlock;
}

const buffer1 = [...buffer];
let right = buffer1.length;
let left = 0;
while (left <= right) {
  while (buffer1[right] == null) right--;
  while (buffer1[left] != null) left++;
  if (left >= right) break;
  buffer1[left] = buffer1[right];
  buffer1[right] = null;
}
console.log(buffer1.reduce<number>((acc, num, i) => (num === null ? acc : acc + num * i), 0));

const buffer2 = [...buffer];
right = buffer2.length;
while (right > 0) {
  while (buffer2[right] == null) right--;
  const rightEnd = right;
  while (buffer2[right] === buffer2[rightEnd]) right--;
  const rightStart = right + 1;
  const length = rightEnd - rightStart + 1;
  let leftStart = 0;
  let leftEnd = 1;
  let spaceFound = false;
  while (leftStart < rightStart) {
    while (buffer2[leftStart] !== null) leftStart++;
    leftEnd = leftStart;
    while (buffer2[leftEnd] === null) leftEnd++;
    leftEnd--;
    if (leftEnd - leftStart + 1 >= length && leftEnd < rightStart) {
      spaceFound = true;
      break;
    }
    leftStart = leftEnd + 1;
  }
  if (spaceFound) {
    for (let i = 0; i < length; i++) {
      buffer2[leftStart + i] = buffer2[rightStart + i];
      buffer2[rightStart + i] = null;
    }
  }
}
console.log(buffer2.reduce<number>((acc, num, i) => (num === null ? acc : acc + num * i), 0));
