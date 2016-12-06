from collections import Counter

with open('2016/6.txt') as f:
    lines = f.read().strip().split('\n')
    columns = [[line[i] for line in lines] for i in range(8)]

print(''.join([Counter(col).most_common()[0][0] for col in columns]))
print(''.join([Counter(col).most_common()[-1][0] for col in columns]))
