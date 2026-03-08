import os
from PIL import Image

# Path to organized test data
test_path = r"C:\Users\Admin\CoffeeGuard\ai-service\data\organized\test"

def find_bad_images(directory):
    corrupted = []
    for root, dirs, files in os.walk(directory):
        for filename in files:
            filepath = os.path.join(root, filename)
            try:
                with Image.open(filepath) as img:
                    img.verify()
            except Exception as e:
                print(f"❌ CORRUPTED FILE: {filepath}")
                corrupted.append(filepath)
    
    if corrupted:
        print(f"\n\n🗑️ Found {len(corrupted)} corrupted files. Delete them? (y/n)")
        response = input().strip().lower()
        if response == 'y':
            for file in corrupted:
                os.remove(file)
                print(f"✅ Deleted: {file}")
            print(f"\n✅ Cleaned {len(corrupted)} corrupted files!")
    else:
        print("✅ No corrupted files found!")

find_bad_images(test_path) 