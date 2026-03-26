import os
import shutil

SOURCE = "data/coffee_dataset/dataset"
DEST = "data/coffee_combined"

CLASS_MAP = {
    "healthy": "healthy",
    "miner": "leaf_miner",
    "rust": "rust",
    "phoma": "phoma"
}

# Create destination folders
for cls in CLASS_MAP.values():
    os.makedirs(os.path.join(DEST, cls), exist_ok=True)

# Loop through train and test
for split in ["train", "test"]:
    split_path = os.path.join(SOURCE, split)

    for class_name in os.listdir(split_path):
        class_path = os.path.join(split_path, class_name)

        if not os.path.isdir(class_path):
            continue

        mapped_class = CLASS_MAP.get(class_name.lower())

        if not mapped_class:
            print(f"Skipping unknown class: {class_name}")
            continue

        for file in os.listdir(class_path):
            src = os.path.join(class_path, file)

            if os.path.isfile(src):
                dst = os.path.join(DEST, mapped_class, file)

                # Avoid overwrite
                if os.path.exists(dst):
                    base, ext = os.path.splitext(file)
                    dst = os.path.join(DEST, mapped_class, base + "_copy" + ext)

                shutil.copy2(src, dst)

print("✅ Dataset recombined successfully!")