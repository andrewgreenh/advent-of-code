with open('2016/2.txt') as f:
    input = f.read().strip()

first = '''
123
456
789
'''.strip().split('\n')

second = '''
00100
02340
56789
0ABC0
00D00
'''.strip('\n').split('\n')

commands = {'U': [0, -1], 'R': [1, 0], 'D': [0, 1], 'L': [-1, 0]}


def getCode(pad, pos):
    for line in input.split('\n'):
        for command in line:
            newX = max(min(pos[0] + commands[command][0], len(pad) - 1), 0)
            newY = max(min(pos[1] + commands[command][1], len(pad) - 1), 0)
            if (pad[newX][newY] != '0'):
                pos = [newX, newY]
        print(pad[pos[1]][pos[0]], end='')
    print('')


getCode(first, [1, 1])
getCode(second, [0, 2])
