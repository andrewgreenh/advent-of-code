import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import syncRequest from 'sync-request';

const cookiePath = join(__dirname, '../sessionCookie.txt');
const cookieString = readFileSync(cookiePath, 'utf8');

if (require.main === module) {
  const day = process.argv[2];
  const year = process.argv[3];
  getInputOfDay(day, year);
}

export function getInputOfDay(day: number | string, year: number | string) {
  const url = `https://adventofcode.com/${year}/day/${day}/input`;
  const response = syncRequest('GET', url, {
    headers: {
      Cookie: cookieString,
      'user-agent':
        'https://github.com/andrewgreenh/advent-of-code/blob/master/TypeScript/load.ts',
    },
  });
  if (response.statusCode === 404) throw new Error('Not ready!');
  const input = response.body.toString();
  writeFileSync(join(__dirname, `src/${year}/${day}.txt`), input);
  console.log(`File written successfully: ${year}/${day}.txt`);
  return input;
}
