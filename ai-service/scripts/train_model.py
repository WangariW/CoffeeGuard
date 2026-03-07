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

print("TensorFlow version:", tf.__version__)
print("GPU available:", tf.config.list_physical_devices('GPU'))

# Data paths
data_dir = Path('data/organized')
train_dir = data_dir / 'train'
val_dir = data_dir / 'validation'
test_dir = data_dir / 'test'

# Parameters
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10  # Start with 10 epochs for testing
NUM_CLASSES = 5

print("\n Loading datasets...")

# Create data generators with augmentation for training
train_datagen = keras.preprocessing.image.ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    zoom_range=0.2,
    fill_mode='nearest'
)

# Validation and test data - only rescaling, no augmentation
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
    layers.Dense(256, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(NUM_CLASSES, activation='softmax')
])

# Compile model
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

print("\n Model Summary:")
model.summary()

# Train model
print(f"\n Starting training for {EPOCHS} epochs...\n")

history = model.fit(
    train_dataset,
    validation_data=val_dataset,
    epochs=EPOCHS,
    verbose=1
)

# Evaluate on test set
print("\n Evaluating on test set...")
test_loss, test_accuracy = model.evaluate(test_dataset)
print(f"\n Test Accuracy: {test_accuracy*100:.2f}%")
print(f" Test Loss: {test_loss:.4f}")

# Save model
model_path = Path('models/coffee_disease_model.h5')
model_path.parent.mkdir(exist_ok=True)
model.save(model_path)
print(f"\n Model saved to: {model_path.absolute()}")

# Plot training history
print("\n Generating training plots...")
plt.figure(figsize=(12, 4))

# Accuracy plot
plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.title('Model Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()
plt.grid(True)

# Loss plot
plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()
plt.grid(True)

plt.tight_layout()
plot_path = Path('models/training_history.png')
plt.savefig(plot_path)
print(f" Training plots saved to: {plot_path.absolute()}")

print("\n Training complete!")