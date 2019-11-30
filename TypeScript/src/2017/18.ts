import * as _ from 'lodash';

import getInput from '../lib/getInput';
import { lines } from '../lib/ts-it/lines';

let cs = [...lines(getInput(18, 2017))];
let index = 0;
let regs = {};
let lastSound = 0;
let get = x => (!_.isNaN(+x) ? +x : regs[x] || 0);
while (true) {
  let c = cs[index].trim().split(' ');
  if (!c) break;
  if (c[0] === 'set') regs[c[1]] = get(c[2]);
  if (c[0] === 'snd') lastSound = get(c[1]);
  if (c[0] === 'add') regs[c[1]] = get(c[1]) + get(c[2]);
  if (c[0] === 'mul') regs[c[1]] = get(c[1]) * get(c[2]);
  if (c[0] === 'mod') regs[c[1]] = get(c[1]) % get(c[2]);
  if (c[0] === 'rcv') if (get(c[1]) !== 0) break;

  if (c[0] === 'jgz') {
    if (get(c[1]) > 0) index += get(c[2]);
    else index++;
  } else index++;
}
console.log(lastSound);

class Program {
  public isWaiting = false;
  public index = 0;
  private queue: any[] = [];
  public sendCount = 0;
  public partner?: Program;

  constructor(public regs: any, public instr: any) {}

  public send(v) {
    this.queue.push(v);
  }

  private get(x) {
    return !_.isNaN(+x) ? +x : this.regs[x] || 0;
  }

  public step() {
    let command = this.instr[this.index];
    let [a, b, c] = command.split(' ');

    if (a === 'set') this.regs[b] = this.get(c);
    if (a === 'snd') {
      this.sendCount++;
      this.partner!.send(this.get(b));
      this.partner!.isWaiting = false;
    }
    if (a === 'add') this.regs[b] = this.get(b) + this.get(c);
    if (a === 'mul') this.regs[b] = this.get(b) * this.get(c);
    if (a === 'mod') this.regs[b] = this.get(b) % this.get(c);
    if (a === 'rcv')
      if (this.queue[0] !== undefined) this.regs[b] = this.queue.shift();
      else {
        this.isWaiting = true;
        return;
      }

    if (a === 'jgz' && this.get(b) > 0) this.index += this.get(c);
    else this.index++;
  }
}

let p0 = new Program({ p: 0 }, cs);
let p1 = new Program({ p: 1 }, cs);
p0.partner = p1;
p1.partner = p0;
while (!p0.isWaiting || !p1.isWaiting) {
  while (!p0.isWaiting) p0.step();
  while (!p1.isWaiting) p1.step();
}

console.log(p1.sendCount);
