import fs from "fs/promises";
import path, { join } from "path";
import { fileURLToPath } from "url";

const day = process.argv[2];

if (!day) {
  throw new Error("Specify a day via cli args");
}

const content = `import { readFile } from "fs/promises";

const inp = await readFile("${day}.txt", "utf8").then((x) => x.slice(0, -1));

let result;
for (const line of inp.split("\\n")) {

}
console.log(result);
`;

const dirname =
  typeof __dirname !== "undefined" ? __dirname : join(fileURLToPath(import.meta.url), "..");

await Promise.all([
  fs.writeFile(path.join(dirname, `../../src/days/${day}.ts`), content),
  fs.writeFile(path.join(dirname, `../../src/days/${day}.txt`), ""),
]);
