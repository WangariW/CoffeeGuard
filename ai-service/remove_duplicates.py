import os
from PIL import Image
import imagehash

DATASET_PATH = "data/final_dataset"

hashes = {}
duplicates = []
checked = 0

for root, dirs, files in os.walk(DATASET_PATH):
    for file in files:
        if file.lower().endswith(('.png', '.jpg', '.jpeg')):
            path = os.path.join(root, file)

            try:
                img = Image.open(path).convert("RGB")
                img_hash = imagehash.phash(img)

                duplicate_found = False

                for existing_hash in hashes:
                    
                    if abs(img_hash - existing_hash) <= 5:
                        print(f"Duplicate found: {path}")
                        duplicates.append(path)
                        duplicate_found = True
                        break

                if not duplicate_found:
                    hashes[img_hash] = path

                checked += 1

            except Exception as e:
                print(f"Error processing {path}: {e}")

# Delete duplicates
for file in duplicates:
    os.remove(file)

print(f"\n✅ Checked {checked} images")
print(f"Removed {len(duplicates)} duplicates")