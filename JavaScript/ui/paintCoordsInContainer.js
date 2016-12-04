const _ = require('lodash');

module.exports = function paintCoordsInContainer(coords, container, timeout = 1) {
  let interval = null;
  const canvas = document.createElement('canvas');
  const p = document.createElement('p');
  container.appendChild(canvas);
  container.appendChild(p);
  const width = 300;
  canvas.width = width + 50;
  canvas.height = width + 50;
  canvas.style.border = '1px solid grey';
  const ctx = canvas.getContext('2d');
  interval = setInterval(step, timeout);
  const minX = _.minBy(coords, '0')[0];
  const minY = _.minBy(coords, '1')[1];
  const maxX = _.maxBy(coords, '0')[0];
  const maxY = _.maxBy(coords, '1')[1];
  const transform = (min, max, scale) => i => ((i - min) / (max - min) * scale);
  const widthScale = width / (maxX - minX);
  const heightScale = width / (maxY - minY);
  const transformX = transform(minX, maxX, width);
  const transformY = transform(minY, maxY, width);

  let index = 0;
  function step() {
    const position = coords[index];
    if (!position) {
      clearInterval(interval);
      return;
    }
    const [x, y] = position;
    ctx.fillStyle = 'red';
    ctx.fillRect(transformX(x), transformY(y), widthScale, heightScale);
    p.innerHTML = `X: ${x}, Y: ${y}`;
    index++;
  }
};
