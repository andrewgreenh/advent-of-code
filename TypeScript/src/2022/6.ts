import getInput from '../lib/getInput';

const input = getInput(6, 2022);

for (let i = 0; i < input.length; i++) {
  const marker = new Set(input.slice(i, i + 4));
  if (marker.size === 4) {
    console.log(i + 4);
    break;
  }
}

for (let i = 0; i < input.length; i++) {
  const marker = new Set(input.slice(i, i + 14));
  if (marker.size === 14) {
    console.log(i + 14);
    break;
  }
}
