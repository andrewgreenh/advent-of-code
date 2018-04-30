import { pipe } from './pipe';
import { printGrid } from './printGrid';
import { range } from './range';
import { rotate } from './rotate';
import { toGrid } from './toGrid';

pipe(range(0, 16))(toGrid(4), rotate('counterclockwise'), printGrid);
