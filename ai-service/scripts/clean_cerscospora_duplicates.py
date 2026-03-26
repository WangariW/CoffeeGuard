import os
from PIL import Image
import imagehash

FOLDER = r"C:\Users\Admin\CoffeeGuard\ai-service\data\JMuBEN\Cerscospora-20210326T085017Z-001\Cerscospora"

seen = {}
duplicates = []

for file in os.listdir(FOLDER):
    path = os.path.join(FOLDER, file)

    if not file.lower().endswith((".jpg", ".jpeg", ".png")):
        continue

    try:
        img = Image.open(path)
        img_hash = imagehash.average_hash(img)

        if img_hash in seen:
            duplicates.append(path)
        else:
            seen[img_hash] = path

    except:
        print("Skipping corrupted:", file)

for dup in duplicates:
    print("Deleting:", dup)
    os.remove(dup)

print("\n✅ Done")
print("Duplicates removed:", len(duplicates))