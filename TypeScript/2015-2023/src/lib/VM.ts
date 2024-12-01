import _ from 'lodash';
import { stringToLines } from './ts-it/lines';

const defaultInstructionSet = {
  set:
    ([a, b]) =>
    (vmState: VMState) => {
      vmState.registers.set(a, vmState.registers.get(b));
      vmState.index++;
    },
  add:
    ([a, b]) =>
    (vmState: VMState) => {
      vmState.registers.set(
        a,
        vmState.registers.get(a) + vmState.registers.get(b),
      );
      vmState.index++;
    },
  mul:
    ([a, b]) =>
    (vmState: VMState) => {
      vmState.registers.set(
        a,
        vmState.registers.get(a) * vmState.registers.get(b),
      );
      vmState.index++;
    },
  mod:
    ([a, b]) =>
    (vmState: VMState) => {
      vmState.registers.set(
        a,
        vmState.registers.get(a) % vmState.registers.get(b),
      );
      vmState.index++;
    },
  jgz:
    ([a, b]) =>
    (vmState: VMState) => {
      if (vmState.registers.get(a) > 0)
        vmState.index += vmState.registers.get(b);
      else vmState.index++;
    },
  jnz:
    ([a, b]) =>
    (vmState: VMState) => {
      if (vmState.registers.get(a) !== 0)
        vmState.index += vmState.registers.get(b);
      else vmState.index++;
    },
};

export class Registers {
  private state: object = {};
  constructor(initializer: object, private defaultValue: any = 0) {
    this.state = initializer;
  }

  public get(numberOrRegName: string) {
    return !_.isNaN(+numberOrRegName)
      ? +numberOrRegName
      : this.state[numberOrRegName] || this.defaultValue;
  }

  public set(name: string, value: any) {
    this.state[name] = value;
  }

  public plain() {
    return this.state;
  }
}

export interface VMState {
  registers: Registers;
  index: number;
  customState: {};
}

export interface InstructionSet {
  [key: string]: (args: any[]) => (state: VMState) => void;
}

export interface Handlers {
  onDone: (vmState: VMState) => void;
  canStep: (vmState: VMState) => boolean | undefined;
  onStep: (vmState: VMState) => void;
  onAfterStep: (vmState: VMState) => void;
}

export class VM {
  private vmState: VMState;
  private instructions: string[];
  private instructionSet: InstructionSet;
  private handlers: Handlers;

  constructor(
    instructionSet: InstructionSet,
    private input: string,
    registerInitializer: object = {},
    initialIndex: number = 0,
    defaultRegisterValue: any = 0,
    initialCustomState: object = {},
    handlers?: Handlers,
  ) {
    this.instructionSet = _.defaults(instructionSet, defaultInstructionSet);
    this.vmState = {
      registers: new Registers(registerInitializer, defaultRegisterValue),
      index: initialIndex,
      customState: initialIndex,
    };
    this.instructions = [...stringToLines(input)];
    this.handlers = _.defaults(handlers, {
      onDone: _.noop,
      canStep: _.constant(true),
      onStep: _.noop,
      onAfterStep: _.noop,
    });
  }

  public step() {
    this.handlers.onStep(this.vmState);
    if (!this.handlers.canStep(this.vmState)) return;
    let instruction = this.instructions[this.vmState.index];
    if (!instruction) return this.handlers.onDone(this.vmState);
    let [name, ...args] = instruction.split(' ');
    this.instructionSet[name](args)(this.vmState);
    this.handlers.onAfterStep(this.vmState);
  }

  public getState() {
    return this.vmState;
  }
}

// let instrSet: InstructionSet = {
//   set: ([a, b]) => (vmState: VMState) => {
//     vmState.registers.set(a, vmState.registers.get(b))
//     vmState.index++
//   },
//   snd: ([a]) => (vmState: VMState) => {
//     lastSound = vmState.registers.get(a)
//     vmState.index++
//   },
//   add: ([a, b]) => (vmState: VMState) => {
//     vmState.registers.set(a, vmState.registers.get(a) + vmState.registers.get(b))
//     vmState.index++
//   },
//   mul: ([a, b]) => (vmState: VMState) => {
//     vmState.registers.set(a, vmState.registers.get(a) * vmState.registers.get(b))
//     vmState.index++
//   },
//   mod: ([a, b]) => (vmState: VMState) => {
//     vmState.registers.set(a, vmState.registers.get(a) % vmState.registers.get(b))
//     vmState.index++
//   },
//   rcv: ([a]) => (vmState: VMState) => {
//     if (vmState.registers.get(a) !== 0) done = true
//   },
//   jgz: ([a, b]) => (vmState: VMState) => {
//     if (vmState.registers.get(a)) vmState.index += vmState.registers.get(b)
//     else vmState.index++
//   },
// }
// let vm = new VM(instrSet, getInput(18, 2017))
