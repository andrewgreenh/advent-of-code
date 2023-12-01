import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const cookiePath = join(__dirname, '../sessionCookie.txt');
const cookieString = readFileSync(cookiePath, 'utf8');

export async function getInputOfDay(
  day: number | string,
  year: number | string,
) {
  const url = `https://adventofcode.com/${year}/day/${day}/input`;
  const response = await fetch(url, {
    headers: {
      Cookie: cookieString,
      'user-agent':
        'https://github.com/andrewgreenh/advent-of-code/blob/master/TypeScript/load.ts',
    },
  }).then((r) => {
    if (!r.ok) {
      throw new Error(`Failed to fetch input: ${r.status} ${r.statusText}`);
    }
    return r.text();
  });

  const input = response;
  writeFileSync(join(__dirname, `src/${year}/${day}.txt`), input);
  console.log(`File written successfully: ${year}/${day}.txt`);
  return input;
}
