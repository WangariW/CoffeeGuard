import os
from PIL import Image

folder = "../data/cerscospora_new"
removed = 0

for file in os.listdir(folder):
    if file.lower().endswith(('.jpg', '.jpeg', '.png')):
        path = os.path.join(folder, file)
        try:
            img = Image.open(path)
            img.verify()
        except:
            print(f"❌ Removing corrupted: {file}")
            os.remove(path)
            removed += 1

print(f"✅ Verified images. Removed {removed} corrupted files")
