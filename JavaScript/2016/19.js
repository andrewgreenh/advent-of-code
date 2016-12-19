const input = +require('../getInput')(19, 2016).trim();

class Node {
  constructor(i) {
    this.i = i;
    this.next = this;
    this.prev = this;
  }

  insert(node) {
    const oldNext = this.next;
    node.next = oldNext;
    oldNext.prev = node;
    this.next = node;
    node.prev = this;
    return node;
  }

  remove() {
    this.prev.next = this.next;
    this.next.prev = this.prev;
    return this.next;
  }
}

function getElves(elfCount) {
  let elf = new Node(1);
  let i = elfCount - 1;
  while (i--) elf = elf.insert(new Node(elfCount - i));
  return elf.next;
}

function solve1(elf) {
  while (elf.next !== elf) elf = elf.next.remove();
  console.log(elf);
}

function solve2(elf) {
  let midElf = getMiddleElf(elf, input);
  let remainingElves = input;
  while (remainingElves--) {
    midElf = midElf.remove();
    elf = elf.next;
    if (remainingElves % 2 === 0) midElf = midElf.next;
  }
  console.log(elf);
}

function getMiddleElf(elf, elfCount) {
  let midIndex = Math.floor(input / 2);
  while (midIndex--) elf = elf.next;
  return elf;
}

solve1(getElves(input));
solve2(getElves(input));
