const Heap = require('heap');

module.exports = function aStar(config) {
  const {
    useCloseList = true,
  } = config;
  if (useCloseList) return aStarWithClosedList(config);
  return aStarWithoutClosedList(config);
};

function aStarWithClosedList(config) {
  const {
    estimateDist = () => 0,
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
  const openNodes = new Heap((a, b) => a.f - b.f);
  const closedNodesByHash = new Map();

  openNodesByHash.set(startNode.hash, startNode);
  openNodes.push(startNode);

  let counter = 0;
  while (!openNodes.empty()) {
    counter++;
    const node = openNodes.pop();
    openNodesByHash.delete(node.hash);

    if (isEnd(node.data)) return finish(node, counter);

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
        const h = estimateDist(currentData);
        const neighbourNode = {
          data: currentData,
          f: g + h,
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
}

function aStarWithoutClosedList(config) {
  const {
    estimateDist = () => 0,
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
  const openNodes = new Heap((a, b) => a.f - b.f);

  openNodesByHash.set(startNode.hash, startNode);
  openNodes.push(startNode);

  let counter = 0;
  while (!openNodes.empty()) {
    counter++;
    const node = openNodes.pop();
    openNodesByHash.delete(node.hash);

    if (isEnd(node.data)) return finish(node, counter);

    const neighbourData = getNeighbours(node.data);
    for (let i = 0; i < neighbourData.length; i++) {
      const currentData = neighbourData[i];
      const hash = hashData(currentData);
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
          f: g + h,
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
}


function finish(node, counter) {
  return {
    status: 'success',
    expandedNodes: counter,
    node,
    cost: node.g,
  };
}
