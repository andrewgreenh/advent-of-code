import re

with open('2016/4.txt') as f:
    input = f.read().strip()

reg = r'(.*)-(\d{3})\[(\w{5})]'


def isRoom(room):
    name = room["name"].replace('-', '')
    expectedCrc = sorted(sorted(set(name)),
                         key=lambda char: name.count(char), reverse=True)[:5]
    return ''.join(expectedCrc) == room["crc"]


def parse(line):
    match = re.match(reg, line)
    return {"name": match.group(1), "id": int(match.group(2)),
            "crc": match.group(3)}


def decrypt(room):
    def rotate(word, n):
        return ''.join([chr(97 + ((ord(c) - 97 + n) % 26)) for c in word])
    words = [rotate(word, room["id"]) for word in room["name"].split('-')]
    room["name"] = ' '.join(words)
    return room


def isNorthPole(room):
    return 'north' in room["name"]


rooms = [r for r in [parse(line) for line in input.split('\n')] if isRoom(r)]
print(sum([room["id"] for room in rooms]))
print([room for room in rooms if (isNorthPole(decrypt(room)))])
