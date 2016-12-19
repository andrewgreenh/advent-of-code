const _ = require('lodash');
const input = +require('../getInput')(19, 2016).trim();

function getElves(i) {
  const elves = _.range(1, 1 + i).map((i, index, array) => new Node(i));
  elves.forEach((node, index, array) => {
    const nextNode = array[(index + 1) % array.length];
    node.next = nextNode;
    nextNode.prv = node;
  });
  return elves;
}

function Node(i) {
  this.i = i;
  this.next = null;
  this.prv = null;
}

Node.prototype.remove = function remove() {
  this.prv.next = this.next;
  this.next.prv = this.prv;
};

function solve1() {
  const elves = getElves(input);
  let elf = elves[0];
  while (elf.next !== elf) {
    elf.next.remove();
    elf = elf.next;
  }
  console.log(elf);
}

function solve2() {
  const elves = getElves(input);
  let elf = elves[0];
  let midElf = elves[Math.floor(elves.length / 2)];
  let remainingElves = elves.length;
  while (elf.next !== elf) {
    midElf.remove();
    elf = elf.next;
    midElf = remainingElves % 2 === 0 ? midElf.next : midElf.next.next;
    remainingElves--;
  }
  console.log(elf);
}

solve1();
solve2();
