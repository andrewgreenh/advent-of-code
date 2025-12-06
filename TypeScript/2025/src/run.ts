import { input } from "./libs/input.ts";

const day = process.argv[2];

if (!day) {
  throw new Error("Specify a day via cli args");
}

// Make sure input is already loaded
await input(Number(day));

process.chdir("./src/days/");

await import(`./days/${day}.ts`);
