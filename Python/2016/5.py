import time
from hashlib import md5
from itertools import count, islice
from multiprocessing import Pool

with open('5.txt') as f:
    start = f.read().strip()


def first(hashes):
    result = ''
    for currHash in islice(hashes, 8):
        result += currHash[5]
        yield currHash
    print(result)
    yield from hashes


def second(hashes):
    result = {}
    for currHash in hashes:
        position, char = (int(currHash[5], 16), currHash[6])
        if position < 8 and position not in result:
            result[position] = char
        if len(result) == 8:
            print(''.join([result[key] for key in result]))
            break


def hash_it(index):
    return md5((start + str(index)).encode('utf-8')).hexdigest()


if __name__ == '__main__':
    pool = Pool()
    allHashes = pool.imap(hash_it, count(), 200000)
    correctHashes = filter(lambda currHash: currHash.startswith('00000'), allHashes)
    second(first(correctHashes))
