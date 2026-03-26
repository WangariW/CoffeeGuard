import os
import shutil
from pathlib import Path

# Define paths
data_dir = Path('data')
output_dir = Path('data/organized')

# Create organized directory structure
classes = ['healthy', 'rust', 'cerscospora', 'phoma', 'leaf_miner']
for split in ['train', 'val', 'test']:
    for cls in classes:
        (output_dir / split / cls).mkdir(parents=True, exist_ok=True)

# Map dataset folders to class names
folder_mapping = {
    'JMuBEN2/Healthy-20210326T083815Z-001/Healthy': 'healthy',
    'JMuBEN/Leaf rust-20210326T083416Z-001/Leaf rust': 'rust',
    'JMuBEN/Cerscospora-20210326T085017Z-001/Cerscospora': 'cerscospora',
    'JMuBEN/Phoma-20210326T082051Z-001/Phoma': 'phoma',
    'JMuBEN2/Miner-20210326T082341Z-001/Miner': 'miner'
}

print("Starting data organization...")

# Process each class
for folder_path, class_name in folder_mapping.items():
    full_path = data_dir / folder_path
    
    if not full_path.exists():
        print(f"Warning: {full_path} not found, skipping...")
        continue
    
    # Get all image files
    images = list(full_path.glob('*.jpg')) + list(full_path.glob('*.jpeg')) + list(full_path.glob('*.png'))
    
    print(f"\nProcessing {class_name}: found {len(images)} images")
    
    # Split: 70% train, 15% validation, 15% test
    train_split = int(len(images) * 0.7)
    val_split = int(len(images) * 0.85)
    
    for i, img_path in enumerate(images):
        if i < train_split:
            split = 'train'
        elif i < val_split:
            split = 'validation'
        else:
            split = 'test'
        
        # Copy image to organized folder
        dest = output_dir / split / class_name / img_path.name
        shutil.copy2(img_path, dest)
    
    print(f"  - Train: {train_split}")
    print(f"  - Validation: {val_split - train_split}")
    print(f"  - Test: {len(images) - val_split}")

print("\n✅ Data organization complete!")
print(f"\nOrganized data location: {output_dir.absolute()}") 
