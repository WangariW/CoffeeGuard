import os
import shutil

SOURCE_FOLDERS = [
    "data/JMuBEN",
    "data/JMuBEN2",
    "data/coffee_combined"
]

DEST = "data/final_dataset"

CLASS_MAP = {
    "leaf rust": "rust",
    "rust": "rust",
    "leaf rust-20210326t083416z-001": "rust",

    "cercospora": "cerscospora",
    "cerscospora": "cerscospora",
    "cerscospora leaf spot": "cerscospora",
    "cerscospora-20210326t085017z-001": "cerscospora",

    "leaf miner": "leaf_miner",
    "miner": "leaf_miner",
    "miner-20210326t082341z-001": "leaf_miner",

    "brown leaf spot": "brown_leaf_spot",

    "healthy": "healthy",
    "healthy-20210326t083815z-001": "healthy",

    "phoma": "phoma",
    "phoma-20210326t082051z-001": "phoma",
}

# Create destination folders
for cls in set(CLASS_MAP.values()):
    os.makedirs(os.path.join(DEST, cls), exist_ok=True)

# Merge datasets
for folder in SOURCE_FOLDERS:
    for class_name in os.listdir(folder):
        class_path = os.path.join(folder, class_name)

        if not os.path.isdir(class_path):
            continue

        mapped_class = None
        for key in CLASS_MAP:
            if key in class_name.lower():
                mapped_class = CLASS_MAP[key]
                break
            
        if not mapped_class:
            print(f"⚠️ Skipping unknown class: {class_name}")
            continue

        for file in os.listdir(class_path):
            src = os.path.join(class_path, file)

            if os.path.isfile(src):
                dst = os.path.join(DEST, mapped_class, file)

                # Avoid overwriting duplicates
                if os.path.exists(dst):
                    base, ext = os.path.splitext(file)
                    dst = os.path.join(DEST, mapped_class, base + "_copy" + ext)

                shutil.copy2(src, dst)

print("✅ Merge complete!")