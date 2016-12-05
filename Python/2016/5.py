import hashlib

with open('2016/5.txt') as f:
    start = f.read().strip()

result1 = ''
result2 = {}
index = 0

while True:
    m = hashlib.md5()
    m.update((start + str(index)).encode('utf-8'))
    index += 1
    hash = m.hexdigest()
    if hash.startswith('00000'):
        if not len(result1) > 7:
            result1 += hash[5]
            print(result1, ''.join([result2[key] for key in result2]))
        num = int(hash[5], 16)
        if num > 7 or num in result2:
            continue
        result2[num] = hash[6]
        print(result1, ''.join([result2[key] for key in result2]))

    if len(result1) > 7 and len(result2) > 7:
        break

print(result1, ''.join([result2[key] for key in result2]))
