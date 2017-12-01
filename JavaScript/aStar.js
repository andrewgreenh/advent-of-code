const _ = require('lodash');
const Heap = require('heap');

module.exports = function aStar(config) {
  const {
    // Used to estimate remaining cost of a node. MUST NOT overestimate the cost.
    estimateCost = () => 0,

    /*
     * Tweaks the order in which nodes get explored.
     *   0 -> Djikstra-search;
     *   1 -> Very fast but not fastes path
     */
    estimationWeight = 0.5,

    // Calculates cost between 2 neighbour nodes.
    getNeighbourCost = () => 1,

    // Returns neighbours of a given node.
    getNeighbours,

    // Returns a string representation of the node.
    hashData,

    // Order in which the nodes get expanded. Return negative number if a should come before b.
    heapComperator = (a, b) => a.f - b.f,

    // Determines if a node is the goal.
    isEnd,

    // When maxCosts is given, the algorithm stops when maxCosts is reached
    maxCosts = Infinity,

    // First node in the open list
    startNode: startData,
  } = config;

  const startNode = {
    // Data for this node (this is passed from the outside)
    data: startData,

    // Current costs to reach this node
    g: 0,

    // Estimated remaining costs for this node.
    h: estimateCost(startData),

    f: estimationWeight * estimateCost(startData),
    hash: hashData(startData),
  };
  const openNodesByHash = new Map();
  const openNodes = new Heap(heapComperator);
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
      const g = node.g + getNeighbourCost(node.data, currentData);

      const existingNode = openNodesByHash.get(hash);
      const isInOpenList = existingNode !== undefined;
      if (isInOpenList && g >= existingNode.g) continue;
      if (isInOpenList) {
        existingNode.g = g;
        existingNode.previousNode = node;
        existingNode.f = g + existingNode.h;
      } else {
        const h = estimateCost(currentData);
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
  return fail(closedNodesByHash, counter);
};

function fail(closedNodesByHash, counter) {
  return {
    status: 'Fail :(',
    expandedNodeCounter: counter,
    getExpandedNodes: () => closedNodesByHash.values(),
  };
}

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
