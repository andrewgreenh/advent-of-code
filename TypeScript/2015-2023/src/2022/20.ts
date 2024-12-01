import { range, sumBy } from 'lodash';
import getInput from '../lib/getInput';
import { numbers } from '../lib/ts-it/numbers';

const nums = numbers(getInput(20, 2022));

type Node = { value: number; next: Node; prev: Node };
function init() {
  let head: Node = { value: nums[0], next: null as any, prev: null as any };
  let tail = (head.prev = head.next = head);
  for (const line of nums.slice(1)) {
    tail.next = { value: line, next: head, prev: tail };
    tail = tail.next;
    head.prev = tail;
  }
  return head;
}
function flatNodes(node: Node) {
  const all = [node];
  while ((node = node.next) !== all[0]) all.push(node);
  return all;
}
function index(n: Node, index: number, size: number) {
  const key = index < 0 ? 'prev' : 'next';
  for (let i = 0; i !== index % size; i += Math.sign(index)) n = n[key];
  return n;
}
function mix(order: Node[]) {
  for (const n of order) {
    n.prev.next = n.next;
    n.next.prev = n.prev;
    const insertAfter = index(n.prev, n.value, nums.length - 1);
    n.prev = insertAfter;
    n.next = insertAfter.next;
    n.next.prev = insertAfter.next = n;
  }
}

const order1 = flatNodes(init());
mix(order1);
const s = order1.find((n) => n.value === 0)!;
console.log(sumBy([1000, 2000, 3000], (n) => index(s, n, nums.length).value));

const order2 = flatNodes(init());
for (const n of order2) n.value *= 811589153;
for (const i of range(0, 10)) mix(order2);
const s2 = order2.find((n) => n.value === 0)!;
console.log(sumBy([1000, 2000, 3000], (n) => index(s2, n, nums.length).value));
