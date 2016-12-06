with open('1.txt') as f:
    input = f.read().strip('\n').split(', ')

factors = [[0, 1], [1, 0], [0, -1], [-1, 0]]
commands = [(s[0], int(s[1:])) for s in input]

x = y = direction = 0
visitedCoordinates = []
firstRecurringCoordinate = []

for command in commands:
    turn = command[0]
    steps = command[1]
    direction = (direction + (1 if turn == 'R' else -1) + 4) % 4
    for step in range(steps):
        x = x + factors[direction][0]
        y = y + factors[direction][1]
        if (not firstRecurringCoordinate and [x, y] in visitedCoordinates):
            firstRecurringCoordinate = [x, y]
        visitedCoordinates.append([x, y])

print(abs(x) + abs(y))
print(sum(map(abs, firstRecurringCoordinate)))
