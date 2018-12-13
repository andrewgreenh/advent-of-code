import getInput from '../lib/getInput';
import { LoopedList } from '../lib/LoopedList';
import { enumerate } from '../lib/ts-it/enumerate';

const input = getInput(13, 2018, true);
const grid = [...input.split('\n')];

const d = {
  '>': [1, 0],
  v: [0, 1],
  '<': [-1, 0],
  '^': [0, -1],
};
const dirs = new LoopedList(['>', 'v', '<', '^']);
const turns = new LoopedList(['left', 'straight', 'right']);
class Cart {
  dead = false;
  turn = 'left';
  key = () => this.pos.join(',');
  constructor(public pos: [number, number], public dirIndex: number) {}
  drive() {
    const dir = dirs.get(this.dirIndex);
    const dirOffset = d[dir];
    this.pos[0] += dirOffset[0];
    this.pos[1] += dirOffset[1];
    const sign = grid[this.pos[1]][this.pos[0]];
    if (sign === '+' && this.turn === 'left') this.dirIndex--;
    if (sign === '+' && this.turn === 'right') this.dirIndex++;
    if (sign === '+') this.turn = turns.get(turns.items.indexOf(this.turn) + 1);
    if (sign === '/' && (dir === '^' || dir === 'v')) this.dirIndex++;
    if (sign === '/' && (dir === '>' || dir === '<')) this.dirIndex--;
    if (sign === '\\' && (dir === '^' || dir === 'v')) this.dirIndex--;
    if (sign === '\\' && (dir === '>' || dir === '<')) this.dirIndex++;
  }
}
let carts: Cart[] = [];
for (const [y, line] of enumerate(grid))
  for (const [x, c] of enumerate(line))
    if ('^v<>'.includes(c)) carts.push(new Cart([x, y], dirs.items.indexOf(c)));

let firstCrash = false;
while (carts.filter(c => !c.dead).length > 1) {
  let byKey = carts.reduce((a, c) => (c.dead ? a : ((a[c.key()] = c), a)), {});
  for (const cart of carts) {
    if (cart.dead) continue;
    cart.drive();
    if (byKey[cart.key()]) {
      if (!firstCrash) console.log(cart.key());
      byKey[cart.key()].dead = cart.dead = firstCrash = true;
    } else byKey[cart.key()] = cart;
  }
}

console.log(carts.find(c => !c.dead)!.key());
