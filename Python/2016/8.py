from collections import deque
from functools import reduce

import numpy as np
from itertools import islice

with open('8.txt') as f:
    lines = f.read().strip().split('\n')


def printGrid(grid):
    print('\n'.join(map(lambda row: ''.join(row), grid)))


def rect(grid, x, y):
    for i in range(x):
        for j in range(y):
            grid[j][i] = '#'


def colRotate(grid, x, rotation):
    transposed = np.transpose(grid)
    newCol = deque(transposed[x])
    newCol.rotate(rotation)
    for i, item in enumerate(newCol):
        grid[i][x] = item


def rowRotate(grid, x, rotation):
    newRow = deque(grid[x])
    newRow.rotate(rotation)
    grid[x] = newRow


grid = [[' ' for i in range(50)] for i in range(6)]

for line in lines:
    command, *rest = line.split(' ')
    if command == 'rect':
        x, y = map(int, rest[0].split('x'))
        rect(grid, x, y)
    else:
        rowOrColumn, n, by, rotation = rest
        n = int(n.split('=')[1])
        rotation = int(rotation)
        if rowOrColumn == 'row':
            rowRotate(grid, n, rotation)
        if rowOrColumn == 'column':
            colRotate(grid, n, rotation)

flat = ''.join(np.array(grid).flatten())
print(flat.count('#'))
printGrid(grid)
