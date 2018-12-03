import * as fs from 'fs';
import * as path from 'path';

import { getInputOfDay } from '../../load';

function getInput(day: number, year: number): string {
  const inputPath = path.join(__dirname, `../${year}/${day}.txt`);
  try {
    const inputString = fs.readFileSync(inputPath, 'utf8');
    return inputString;
  } catch (e) {
    // File not found
    if (e.errno === -4058) {
      const content = getInputOfDay(day, year);
      return content;
    }
    throw e;
  }
}

export default getInput;
