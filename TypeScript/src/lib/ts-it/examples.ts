const items = new Map([['a', 1], ['b', 4]]);

for (const i of items) {
  console.log(i);
}

const copied = [...items];

console.log(copied);
