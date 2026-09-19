import sys
sys.path.insert(0, '.')
from app.models.classifier import classify_image

with open('test_herb.jpg', 'rb') as f:
    result = classify_image(f.read())

print('Top prediction:', result['herb_name'], '-', str(result['confidence']) + '%')
print('Top-5:')
for t in result['top5']:
    print('  ' + t['herb_name'] + ': ' + str(t['confidence']) + '%')
total = sum(t['confidence'] for t in result['top5'])
print('Sum of top-5:', round(total, 1), '%')
print('All scores valid (0-100):', all(0 <= t['confidence'] <= 100 for t in result['top5']))
