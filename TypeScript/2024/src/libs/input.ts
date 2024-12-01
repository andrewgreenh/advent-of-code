import * as fs from "fs/promises";
import * as path from "path";
import { join } from "path";
import { fileURLToPath } from "url";

const dirname =
  typeof __dirname !== "undefined" ? __dirname : join(fileURLToPath(import.meta.url), "..");
const srcDir = path.join(dirname, "..");

const year = 2024;

export async function input(day: number, noTrim = false) {
  const inputPath = path.join(srcDir, `days/${day}.txt`);

  const inputExists = await fs
    .stat(inputPath)
    .then(() => true)
    .catch(() => false);

  if (!inputExists) {
    await downloadDay(day, year);
  }
  let inputString = await fs.readFile(inputPath, "utf8");

  if (inputString.length === 0) {
    await downloadDay(day, year);
    inputString = await fs.readFile(inputPath, "utf8");
  }

  const transformed = noTrim ? inputString : inputString.trim();
  return transformed;
}

const cookiePath = join(srcDir, "../../../sessionCookie.txt");
const cookieString = await fs.readFile(cookiePath, "utf8");

export async function downloadDay(day: number | string, year: number | string) {
  const url = `https://adventofcode.com/${year}/day/${day}/input`;
  const response = await fetch(url, {
    headers: {
      Cookie: cookieString,
      "user-agent": "https://github.com/andrewgreenh/advent-of-code/blob/master/TypeScript/",
    },
  }).then((r) => {
    if (!r.ok) {
      throw new Error(`Failed to fetch input: ${r.status} ${r.statusText}`);
    }
    return r.text();
  });

  const input = response;
  await fs.writeFile(join(srcDir, `days/${day}.txt`), input);
  console.log(`File written successfully: ${year}/${day}.txt`);
  return input;
}
