import os
import shutil
import random

SOURCE = "../data/final_dataset"
DEST = "../data/organized"

SPLITS = {
    "train": 0.7,
    "val": 0.2,
    "test": 0.1
}

# Create folders
for split in SPLITS:
    for cls in os.listdir(SOURCE):
        os.makedirs(os.path.join(DEST, split, cls), exist_ok=True)

# Split data
for cls in os.listdir(SOURCE):
    cls_path = os.path.join(SOURCE, cls)
    images = os.listdir(cls_path)

    random.shuffle(images)

    total = len(images)
    train_end = int(total * SPLITS["train"])
    val_end = int(total * (SPLITS["train"] + SPLITS["val"]))

    for i, img in enumerate(images):
        src = os.path.join(cls_path, img)

        if i < train_end:
            dst = os.path.join(DEST, "train", cls, img)
        elif i < val_end:
            dst = os.path.join(DEST, "val", cls, img)
        else:
            dst = os.path.join(DEST, "test", cls, img)

        shutil.copy2(src, dst)

print("✅ Dataset split into organized folder")