const input = [[17, 1], [7, 0], [19, 2], [5, 0], [3, 0], [13, 5], [11, 0]];
const d = input.map(([size, position], index) => t => ((position + t + 1 + index) % size === 0));

let t1 = 0;
while (d.slice(0, 6).some(i => !i(t1))) t1++;
let t2 = 0;
while (d.some(i => !i(t2))) t2++;
console.log(t1, t2);
