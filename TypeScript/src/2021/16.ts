import { max, min } from 'lodash';
import getInput from '../lib/getInput';
import { sum } from '../lib/ts-it/sum';

const input = [...getInput(16, 2021).trim()]
  .map((c) => parseInt(c, 16).toString(2).padStart(4, '0'))
  .join('');

const ast = parsePacket(input);
let part1 = 0;
count(ast[0]);
console.log(part1);
console.log(evaluate(ast[0]));

function count(node: Node) {
  part1 += node.version;
  if (node.type === 'OPERATOR') {
    for (const n of node.nodes) count(n);
  }
}

function evaluate(node: Node): number {
  if (node.type === 'LITERAL') return node.value;
  const childValues = node.nodes.map(evaluate);
  const op = node.operatorId;
  const opMap = {
    0: sum,
    1: (num: number[]) => num.reduce((a, b) => a * b),
    2: min,
    3: max,
    5: ([a, b]: [number, number]) => (a > b ? 1 : 0),
    6: ([a, b]: [number, number]) => (a < b ? 1 : 0),
    7: ([a, b]: [number, number]) => (a === b ? 1 : 0),
  };
  return opMap[op](childValues);
}

type Node =
  | {
      version: number;
      type: 'LITERAL';
      value: number;
    }
  | {
      version: number;
      type: 'OPERATOR';
      operatorId: number;
      nodes: Node[];
    };

function parsePacket(rest: string): [Node, string] {
  let taken = '';
  [taken, rest] = take(3, rest);
  const version = parseInt(taken, 2);
  [taken, rest] = take(3, rest);
  const typeId = parseInt(taken, 2);

  if (typeId === 4) {
    let num = '';
    while (true) {
      [taken, rest] = take(5, rest);
      num += taken.slice(1);
      if (taken[0] === '0') break;
    }
    const parsed = parseInt(num, 2);
    return [{ type: 'LITERAL', value: parsed, version }, rest];
  } else {
    [taken, rest] = take(1, rest);
    const lengthTypeId = taken;
    const subNodes: Node[] = [];

    if (lengthTypeId === '0') {
      [taken, rest] = take(15, rest);
      const lengthOfSubPackets = parseInt(taken, 2);
      [taken, rest] = take(lengthOfSubPackets, rest);
      let subPacketRest = taken;
      while (subPacketRest.length) {
        let packetNode;
        [packetNode, subPacketRest] = parsePacket(subPacketRest);
        subNodes.push(packetNode);
      }
    }
    if (lengthTypeId === '1') {
      [taken, rest] = take(11, rest);
      let numberOfSubPackages = parseInt(taken, 2);
      while (numberOfSubPackages--) {
        let packetNode;
        [packetNode, rest] = parsePacket(rest);
        subNodes.push(packetNode);
      }
    }

    return [
      { type: 'OPERATOR', nodes: subNodes, version, operatorId: typeId },
      rest,
    ];
  }
}

function take(n: number, rest: string) {
  const taken = rest.slice(0, n);
  const newRest = rest.slice(n);
  return [taken, newRest];
}
