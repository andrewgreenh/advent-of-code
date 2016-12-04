const _ = require('lodash');

const container = document.createElement('div');
container.classList.add('container');
const select = document.createElement('select');
_.times(24, i => {
  const option = document.createElement('option');
  option.textContent = `Day ${i + 1}`;
  option.value = i + 1;
  select.appendChild(option);
});
const button = document.createElement('button');
const stop = document.createElement('button');
button.textContent = 'Reload script!';
stop.textContent = 'Stop script';
document.body.appendChild(select);
document.body.appendChild(button);
document.body.appendChild(stop);
document.body.appendChild(container);

let currentModule = null;
button.addEventListener('click', () => {
  stopModule();
  const day = select.value;
  container.innerHTML = '';
  const moduleName = `${__dirname}/../2016/${day}.js`;
  delete require.cache[require.resolve(moduleName)];
  // eslint-disable-next-line
  try {
    currentModule = require(moduleName);
    currentModule.run(container);
  } catch (e) {
    console.warn(e);
    currentModule = null;
    container.innerHTML = 'Script not ready for electron';
  }
});

stop.addEventListener('click', stopModule);

function stopModule() {
  _.invoke(currentModule, 'stop');
}
