import 'core-js/stable';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { getInputOfDay } from '../../../load-async';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : join(fileURLToPath(import.meta.url), '..');

export async function asyncGetInput(
  day: number,
  year: number,
  noTrim = false,
): Promise<string> {
  const inputPath = path.join(dirname, `../${year}/${day}.txt`);
  try {
    const inputString = fs.readFileSync(inputPath, 'utf8');
    if (inputString.length === 0) {
      throw new Error('File still empty');
    }
    const transformed = noTrim ? inputString : inputString.trim();
    return transformed;
  } catch (e: any) {
    const content = await getInputOfDay(day, year);
    const transformed = noTrim ? content : content.trim();
    return transformed;
  }
}
