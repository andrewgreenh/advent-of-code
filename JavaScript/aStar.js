const _ = require('lodash');
const Heap = require('heap');

module.exports = function aStar(config) {
  const {
    estimateDist = () => 0,
    estimationWeight = 0.5,
    getNeighbourDist,
    getNeighbours,
    hashData,
    isEnd,
    maxCosts = Infinity,
    startNode: startData,
  } = config;

  const startNode = {
    data: startData,
    f: estimationWeight * estimateDist(startData),
    g: 0,
    h: estimateDist(startData),
    hash: hashData(startData),
  };
  const openNodesByHash = new Map();
  const openNodes = new Heap((a, b) => a.f - b.f);
  const closedNodesByHash = new Map();

  openNodesByHash.set(startNode.hash, startNode);
  openNodes.push(startNode);

  let counter = 0;
  while (!openNodes.empty()) {
    const node = openNodes.pop();
    openNodesByHash.delete(node.hash);

    closedNodesByHash.set(node.hash, node);
    if (isEnd(node.data)) return finish(node, counter, closedNodesByHash);
    if (node.g > maxCosts) return finish(node, counter, closedNodesByHash);
    counter++;


    const neighbourData = getNeighbours(node.data);
    for (let i = 0; i < neighbourData.length; i++) {
      const currentData = neighbourData[i];
      const hash = hashData(currentData);
      if (closedNodesByHash.has(hash)) continue;
      const g = node.g + getNeighbourDist(node.data, currentData);

      const existingNode = openNodesByHash.get(hash);
      const isInOpenList = existingNode !== undefined;
      if (isInOpenList && g >= existingNode.g) continue;
      if (isInOpenList) {
        existingNode.g = g;
        existingNode.previousNode = node;
        existingNode.f = g + existingNode.h;
      } else {
        const h = estimateDist(currentData);
        const neighbourNode = {
          data: currentData,
          f: (1 - estimationWeight) * g + estimationWeight * h,
          h,
          g,
          hash,
          previousNode: node,
        };
        openNodesByHash.set(hash, neighbourNode);
        openNodes.push(neighbourNode);
      }
    }
  }
  return 'Fail :)';
};

function finish(node, counter, closedNodesByHash) {
  const path = recursiveNodeToArray(node);
  return {
    status: 'success',
    cost: node.g,
    expandedNodeCounter: counter,
    getExpandedNodes: () => closedNodesByHash.values(),
    target: path[path.length - 1],
    getPath: () => path,
  };
}

function recursiveNodeToArray(node) {
  const result = [];
  let current = node;
  while (current) {
    result.unshift(_.omit(current, 'previousNode'));
    current = current.previousNode;
  }
  return result;
}
