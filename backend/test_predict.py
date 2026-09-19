import requests

with open('test_herb.jpg', 'rb') as f:
    r = requests.post(
        'http://localhost:8000/api/predict',
        files={'file': ('test_herb.jpg', f, 'image/jpeg')}
    )

data = r.json()
print("Status:", r.status_code)
print("Top prediction:", data.get('herb_name'), "|", data.get('confidence'), "%")
print("Top-5:")
for t in data.get('top5', []):
    print("  {}: {}%".format(t["herb_name"], t["confidence"]))
gc = data.get('gradcam_image', '')
print("GradCAM:", "Generated ({} chars)".format(len(gc)) if gc else "Empty")
print("Disclaimer:", data.get('disclaimer', '')[:80])
