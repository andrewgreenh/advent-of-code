const Heap = require('heap');

module.exports = function aStar(config) {
  const {
    estimateDist,
    getNeighbourDist,
    getNeighbours,
    hashData,
    isEnd,
    startNode: startData,
  } = config;
  const startNode = {
    data: startData,
    f: estimateDist(startData),
    g: 0,
    h: estimateDist(startData),
    hash: hashData(startData),
  };
  const openNodesByHash = new Map();
  openNodesByHash.set(startNode.hash, startNode);
  const openNodes = new Heap((a, b) => a.f - b.f);
  openNodes.push(startNode);
  const closedNodesByHash = new Map();

  const endNodesByHash = new Map();

  while (!openNodes.empty()) {
    const node = openNodes.pop();
    openNodesByHash.delete(node.hash);

    if (isEnd(node.data)) {
      console.log('hehe');
      const previousFinding = endNodesByHash.get(node.hash);
      const alreadyFound = previousFinding !== undefined;
      if (alreadyFound && previousFinding.g >= node.g) {
        endNodesByHash.set(node.hash, node);
      }
    }

    closedNodesByHash.set(node.hash, node);

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
        const neighbourNode = {
          data: currentData,
          f: g + estimateDist(currentData),
          g,
          hash,
          previousNode: node,
        };
        openNodesByHash.set(hash, neighbourNode);
        openNodes.push(neighbourNode);
      }
    }
  }
  return endNodesByHash;
};
