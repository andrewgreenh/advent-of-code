import fs from "fs/promises";
import path, { join } from "path";
import { fileURLToPath } from "url";

const day = process.argv[2];

if (!day) {
  throw new Error("Specify a day via cli args");
}

const content = `import { input } from "../libs/input.ts";

const inp = await input(${day});

for (const line of inp.split("\\n")) {
  console.log(line);
}
`;

const dirname =
  typeof __dirname !== "undefined" ? __dirname : join(fileURLToPath(import.meta.url), "..");

await Promise.all([
  fs.writeFile(path.join(dirname, `../../src/days/${day}.ts`), content),
  fs.writeFile(path.join(dirname, `../../src/days/${day}.txt`), ""),
]);
