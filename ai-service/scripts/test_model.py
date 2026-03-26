import tensorflow as tf
from tensorflow import keras
import numpy as np
from pathlib import Path
from PIL import Image
import sys

# Load the trained model
model_path = Path('models/coffee_disease_model.h5')

print(" Loading trained model...")
try:
    model = keras.models.load_model(model_path)
    print(f" Model loaded successfully from {model_path}")
except Exception as e:
    print(f" Error loading model: {e}")
    sys.exit(1)

# Disease classes 
CLASS_NAMES = ['cerscospora', 'healthy', 'leaf_miner', 'phoma', 'rust']

def predict_disease(image_path):
    """
    Predict disease from a single image
    
    Args:
        image_path: Path to the coffee leaf image
        
    Returns:
        dict with prediction results
    """
    try:
        # Load and preprocess image
        img = Image.open(image_path)
        img = img.resize((224, 224))  # Resize to model input size
        img_array = np.array(img) / 255.0  # Normalize to 0-1
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        
        # Make prediction
        predictions = model.predict(img_array, verbose=0)
        predicted_class_idx = np.argmax(predictions[0])
        confidence = predictions[0][predicted_class_idx]
        
        # Get all class probabilities
        class_probabilities = {
            CLASS_NAMES[i]: float(predictions[0][i]) 
            for i in range(len(CLASS_NAMES))
        }
        
        result = {
            'predicted_disease': CLASS_NAMES[predicted_class_idx],
            'confidence': float(confidence),
            'all_probabilities': class_probabilities
        }
        
        return result
        
    except Exception as e:
        return {'error': str(e)}

def test_on_sample_images():
    """Test the model on sample images from each category"""
    
    print("\n Testing model on sample images...\n")
    
    # Test one image from each class
    test_categories = ['healthy', 'rust', 'cerscospora', 'phoma', 'leaf_miner']
    
    total_tested = 0
    total_correct = 0
    
    for category in test_categories:
        category_path = Path(f'data/organized/test/{category}')
        
        if not category_path.exists():
            print(f" Category path not found: {category_path}")
            continue
            
        # Get first image from category
        images = list(category_path.glob('*.jpg')) + list(category_path.glob('*.jpeg'))
        
        if not images:
            print(f" No images found in {category}")
            continue
            
        test_image = images[0]
        
        print(f"Testing: {category.upper()}")
        print(f"Image: {test_image.name}")
        
        result = predict_disease(test_image)
        
        if 'error' in result:
            print(f" Error: {result['error']}\n")
        else:
            predicted = result['predicted_disease']
            confidence = result['confidence'] * 100
            
            # Check if prediction is correct
            is_correct = predicted == category
            total_tested += 1
            if is_correct:
                total_correct += 1
                
            status = " CORRECT" if is_correct else " INCORRECT"
            
            print(f"Prediction: {predicted.upper()} ({confidence:.2f}%) {status}")
            print(f"All probabilities:")
            for disease, prob in sorted(result['all_probabilities'].items(), 
                                       key=lambda x: x[1], reverse=True):
                print(f"  {disease}: {prob*100:.2f}%")
            print()
            
    if total_tested > 0:
        accuracy = (total_correct / total_tested) * 100
        print(f"Overall Accuracy : {accuracy:.1f}% ({total_correct}/{total_tested})")
        
        
def test_single_image(image_path):
    """Test model on a single user-provided image"""
    
    print(f"\n Testing image: {image_path}\n")
    
    result = predict_disease(image_path)
    
    if 'error' in result:
        print(f" Error: {result['error']}")
    else:
        print(f" Prediction: {result['predicted_disease'].upper()}")
        print(f" Confidence: {result['confidence']*100:.2f}%")
        print(f"\nAll probabilities:")
        for disease, prob in sorted(result['all_probabilities'].items(), 
                                   key=lambda x: x[1], reverse=True):
            print(f"  {disease}: {prob*100:.2f}%")

if __name__ == "__main__":
    # Check if user provided an image path
    if len(sys.argv) > 1:
        # Test on user-provided image
        test_single_image(sys.argv[1])
    else:
        # Run automated tests on sample images
        test_on_sample_images()
        
    print("\n Testing complete!")
    print("\nTo test a specific image, run:")
    print("  python scripts/test_model.py path/to/image.jpg")
    