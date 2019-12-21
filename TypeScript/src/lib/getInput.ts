import 'core-js/stable';
import * as fs from 'fs';
import * as path from 'path';
import { getInputOfDay } from '../../load';

function getInput(day: number, year: number, noTrim = false): string {
  const inputPath = path.join(__dirname, `../${year}/${day}.txt`);
  try {
    const inputString = fs.readFileSync(inputPath, 'utf8');
    const transformed = noTrim ? inputString : inputString.trim();
    return transformed;
  } catch (e) {
    // File not found
    if (e.errno === -4058) {
      const content = getInputOfDay(day, year);
      const transformed = noTrim ? content : content.trim();
      return transformed;
    }
    throw e;
  }
}

export default getInput;
