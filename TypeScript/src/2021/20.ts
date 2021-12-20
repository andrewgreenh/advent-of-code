import { countBy, range } from 'lodash';
import getInput from '../lib/getInput';
import { cross } from '../lib/ts-it/cross';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(20, 2021);
const [algorithm, ...imgData] = stringToLines(input);

const pad = 51;
let image = [
  ...range(0, pad).map((i) => ''.repeat(imgData.length + 2 * pad)),
  ...imgData.map((line) => '.'.repeat(pad) + line + '.'.repeat(pad)),
  ...range(0, pad).map((i) => ''.repeat(imgData.length + 2 * pad)),
].map((l) => l.split(''));

let paddingPixel = '.';
for (let i = 0; i < 50; i++) {
  let enhancedImage: typeof image = [];
  for (let y = 0; y < image.length; y++) {
    for (let x = 0; x < image.length; x++) {
      let indexBit = '';
      for (let [ny, nx] of cross(range(y - 1, y + 2), range(x - 1, x + 2))) {
        indexBit += (image[ny]?.[nx] ?? paddingPixel) === '#' ? '1' : '0';
      }
      const newPixel = algorithm[parseInt(indexBit, 2)];
      if (!enhancedImage[y]) enhancedImage[y] = [];
      enhancedImage[y][x] = newPixel;
    }
  }

  image = enhancedImage;
  paddingPixel = image[0][0];

  if (i === 1 || i === 49) {
    console.log(countBy(image.flat())['#']);
  }
}
