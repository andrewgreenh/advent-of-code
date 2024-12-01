import 'core-js/stable';
import * as fs from 'fs';
import * as path from 'path';
import { getInputOfDay } from '../../../load';

function getInput(day: number, year: number, noTrim = false): string {
  const inputPath = path.join(__dirname, `../${year}/${day}.txt`);
  try {
    const inputString = fs.readFileSync(inputPath, 'utf8');
    if (inputString.length === 0) {
      throw new Error('File still empty');
    }
    const transformed = noTrim ? inputString : inputString.trim();
    return transformed;
  } catch (e: any) {
    const content = getInputOfDay(day, year);
    const transformed = noTrim ? content : content.trim();
    return transformed;
  }
}

export default getInput;
