import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications import MobileNetV2
import matplotlib.pyplot as plt
from pathlib import Path
import numpy as np

# Set random seed for reproducibility
tf.random.set_seed(42)
np.random.seed(42)

print("CoffeeGuard AI Training")
print("=" * 60)
print("TensorFlow version:", tf.__version__)
print("GPU available:", tf.config.list_physical_devices('GPU'))

# Data paths
data_dir = Path('data/organized')
train_dir = data_dir / 'train'
val_dir = data_dir / 'val'
test_dir = data_dir / 'test'

# Parameters
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 30  
NUM_CLASSES = 5

print("\n Loading datasets...")

# Augmentation for training
train_datagen = keras.preprocessing.image.ImageDataGenerator(
    rescale=1./255,
    rotation_range=45,
    width_shift_range=0.3,
    height_shift_range=0.3,
    shear_range=0.2,
    zoom_range=0.3,
    horizontal_flip=True,
    vertical_flip=True,
    fill_mode='reflect',
    brightness_range=[0.7, 1.3]
)

# Validation and test data 
val_test_datagen = keras.preprocessing.image.ImageDataGenerator(rescale=1./255)

# Load datasets
train_dataset = train_datagen.flow_from_directory(
    train_dir,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

val_dataset = val_test_datagen.flow_from_directory(
    val_dir,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

test_dataset = val_test_datagen.flow_from_directory(
    test_dir,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    shuffle=False
)

print(f"\n Found {train_dataset.samples} training images")
print(f" Found {val_dataset.samples} validation images")
print(f" Found {test_dataset.samples} test images")
print(f"\nClass labels: {train_dataset.class_indices}")

# Build model using Transfer Learning
print("\n Building model with MobileNetV2...")

# Load pre-trained MobileNetV2 (without top classification layer)
base_model = MobileNetV2(
    weights='imagenet',
    include_top=False,
    input_shape=(*IMG_SIZE, 3)
)

# Freeze base model layers (we're using pre-trained weights)
base_model.trainable = False

# Build complete model
model = keras.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(256, activation='relu', kernel_regularizer=keras.regularizers.l2(0.001)),
    layers.BatchNormalization(),
    layers.Dropout(0.5),
    layers.Dense(128, activation='relu', kernel_regularizer=keras.regularizers.l2(0.001)),
    layers.Dropout(0.3),
    layers.Dense(NUM_CLASSES, activation='softmax')
])

# Compile model
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.0001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

print("\n Model built with {model.count_params():,} parameters")
print(f"  Trainable: {sum([tf.size(w).numpy() for w in model.trainable_weights]):,}")
print(f"  Non-trainable: {sum([tf.size(w).numpy() for w in model.non_trainable_weights]):,}")


# Setup callbacks
early_stop = keras.callbacks.EarlyStopping(
    monitor='val_loss',
    patience=5,
    restore_best_weights=True,
    verbose=1
)
 
checkpoint = keras.callbacks.ModelCheckpoint(
    'models/best_model.h5',
    monitor='val_accuracy',
    save_best_only=True,
    mode='max',
    verbose=1
)
 
reduce_lr = keras.callbacks.ReduceLROnPlateau(
    monitor='val_loss',
    factor=0.5,
    patience=3,
    min_lr=1e-7,
    verbose=1
)

# Train model
print(f"\n Starting training for {EPOCHS} epochs...\n")
print("=" * 60)


history = model.fit(
    train_dataset,
    validation_data=val_dataset,
    epochs=EPOCHS,
    verbose=1,
    callbacks=[early_stop, checkpoint, reduce_lr]
)

# Save model first before testing
model_path = Path('models/coffee_disease_model.h5')
model_path.parent.mkdir(exist_ok=True)
model.save(model_path)


print("\n" + "=" * 60)
print(" Training complete!")
print(f" Model saved to: {model_path.absolute()}")

# Evaluate on test set (with error handling for corrupted images)
print("\n Evaluating on test set...")
try:
    test_loss, test_accuracy = model.evaluate(test_dataset)
    print(f"\n FINAL RESULTS:")
    print(f"   Training Accuracy: {history.history['accuracy'][-1]*100:.2f}%")
    print(f"   Validation Accuracy: {history.history['val_accuracy'][-1]*100:.2f}%")
    print(f"\n Test Accuracy: {test_accuracy*100:.2f}%")
    print(f" Test Loss: {test_loss:.4f}")
except Exception as e:
    print(f"\n Test evaluation failed (likely corrupted image): {str(e)[:100]}")
    print(f" Using final validation accuracy: {history.history['val_accuracy'][-1]*100:.2f}%")

# Plot training history
print("\n Generating training plots...")
try:
    plt.figure(figsize=(14, 5))

    # Accuracy plot
    plt.subplot(1, 2, 1)
    plt.plot(history.history['accuracy'], label='Training Accuracy', linewidth=2)
    plt.plot(history.history['val_accuracy'], label='Validation Accuracy', linewidth=2)
    plt.axhline(y=0.8, color='g', linestyle='--', alpha=0.3, label='80% Target')
    plt.title('Model Accuracy', fontsize=14, fontweight='bold')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()
    plt.grid(True, alpha=0.3)

    # Loss plot
    plt.subplot(1, 2, 2)
    plt.plot(history.history['loss'], label='Training Loss', linewidth=2)
    plt.plot(history.history['val_loss'], label='Validation Loss', linewidth=2)
    plt.title('Model Loss', fontsize=14, fontweight='bold')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    plt.grid(True, alpha=0.3)

    plt.tight_layout()
    plot_path = Path('models/training_history.png')
    plt.savefig(plot_path, dpi=150, bbox_inches='tight')
    print(f" Training plots saved to: {plot_path.absolute()}")
except Exception as e:
    print(f" Could not generate plots: {e}")


# Per-class performance
print("\n Per-Class Performance:")
try:
    predictions = model.predict(test_dataset)
    predicted_classes = np.argmax(predictions, axis=1)
    true_classes = test_dataset.classes
    
    class_names = list(test_dataset.class_indices.keys())
    
    for i, class_name in enumerate(class_names):
        class_mask = true_classes == i
        if class_mask.sum() > 0:
            class_acc = (predicted_classes[class_mask] == true_classes[class_mask]).mean()
            print(f"   {class_name}: {class_acc*100:.1f}% ({class_mask.sum()} samples)")
except Exception as e:
    print(f"   Could not compute per-class accuracy: {e}")


print("\n All done!")
print("\n Next steps:")
print("   1. Check training_history.png for convergence")
print("   2. Test with real images: python scripts/test_model.py")
print("   3. Run API service: python api.py")
