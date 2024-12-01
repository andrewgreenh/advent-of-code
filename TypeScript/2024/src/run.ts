const day = process.argv[2];

if (!day) {
  throw new Error("Specify a day via cli args");
}

await import(`./days/${day}.ts`);

export {};
