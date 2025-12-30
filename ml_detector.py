#!/usr/bin/env python3
"""
Advanced ML-based Ad Detection for YouTube Ad Blocker Pro
Uses machine learning to identify and classify YouTube ads with high accuracy
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import json
import re
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AdvancedAdDetector:
    """Machine Learning based YouTube Ad Detection System"""
    
    def __init__(self):
        self.model = None
        self.vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.is_trained = False
        self.features = [
            'has_ad_keywords', 'has_sponsored_text', 'is_promoted',
            'has_ad_badge', 'video_duration_short', 'description_length',
            'title_contains_ad', 'channel_verified', 'view_count_low',
            'like_ratio_low', 'comment_count_low', 'upload_frequency_high'
        ]
        
    def extract_features(self, element_data):
        """Extract features from YouTube element data"""
        features = {}
        
        # Text-based features
        title = element_data.get('title', '').lower()
        description = element_data.get('description', '').lower()
        
        # Ad keyword detection
        ad_keywords = ['ad', 'advertisement', 'sponsored', 'promotion', 'paid', 'commercial']
        features['has_ad_keywords'] = any(keyword in title for keyword in ad_keywords)
        features['has_sponsored_text'] = any(keyword in description for keyword in ad_keywords)
        features['title_contains_ad'] = features['has_ad_keywords'] or features['has_sponsored_text']
        
        # Visual indicators
        features['has_ad_badge'] = element_data.get('has_ad_badge', False)
        features['is_promoted'] = element_data.get('is_promoted', False)
        
        # Video metadata features
        duration = element_data.get('duration', 0)
        features['video_duration_short'] = duration < 30 and duration > 0
        
        features['description_length'] = len(description)
        features['description_too_short'] = len(description) < 50
        
        # Channel features
        features['channel_verified'] = element_data.get('channel_verified', False)
        features['subscriber_count_low'] = element_data.get('subscriber_count', 0) < 1000
        
        # Engagement metrics
        view_count = element_data.get('view_count', 0)
        like_count = element_data.get('like_count', 0)
        comment_count = element_data.get('comment_count', 0)
        
        features['view_count_low'] = view_count < 10000
        features['like_ratio_low'] = (like_count / max(view_count, 1)) < 0.01
        features['comment_count_low'] = comment_count < 100
        
        # Upload frequency
        upload_freq = element_data.get('upload_frequency', 0)
        features['upload_frequency_high'] = upload_freq > 10  # uploads per day
        
        # URL patterns
        url = element_data.get('url', '').lower()
        ad_patterns = ['doubleclick', 'googleads', 'youtube.com/ads', 'advertising']
        features['url_has_ad_patterns'] = any(pattern in url for pattern in ad_patterns)
        
        return features
    
    def prepare_training_data(self, dataset_path=None):
        """Prepare training dataset"""
        if dataset_path is None:
            # Generate synthetic training data based on known patterns
            return self.generate_synthetic_data()
        
        try:
            df = pd.read_csv(dataset_path)
            return df
        except Exception as e:
            logger.error(f"Error loading dataset: {e}")
            return self.generate_synthetic_data()
    
    def generate_synthetic_data(self):
        """Generate synthetic training data for demonstration"""
        np.random.seed(42)
        n_samples = 1000
        
        data = []
        for i in range(n_samples):
            # Generate random features
            sample = {
                'has_ad_keywords': np.random.choice([True, False], p=[0.3, 0.7]),
                'has_sponsored_text': np.random.choice([True, False], p=[0.2, 0.8]),
                'title_contains_ad': np.random.choice([True, False], p=[0.25, 0.75]),
                'has_ad_badge': np.random.choice([True, False], p=[0.15, 0.85]),
                'is_promoted': np.random.choice([True, False], p=[0.2, 0.8]),
                'video_duration_short': np.random.choice([True, False], p=[0.4, 0.6]),
                'description_length': np.random.randint(10, 500),
                'channel_verified': np.random.choice([True, False], p=[0.3, 0.7]),
                'view_count_low': np.random.choice([True, False], p=[0.3, 0.7]),
                'like_ratio_low': np.random.choice([True, False], p=[0.35, 0.65]),
                'comment_count_low': np.random.choice([True, False], p=[0.4, 0.6]),
                'upload_frequency_high': np.random.choice([True, False], p=[0.25, 0.75]),
                'url_has_ad_patterns': np.random.choice([True, False], p=[0.1, 0.9])
            }
            
            # Label as ad based on multiple indicators
            ad_indicators = [
                sample['has_ad_keywords'], sample['has_sponsored_text'],
                sample['has_ad_badge'], sample['is_promoted'],
                sample['url_has_ad_patterns']
            ]
            
            # Higher probability of being an ad if multiple indicators are present
            ad_probability = sum(ad_indicators) / len(ad_indicators)
            sample['is_ad'] = ad_probability > 0.4 or (sample['video_duration_short'] and sample['view_count_low'])
            
            data.append(sample)
        
        return pd.DataFrame(data)
    
    def train_model(self, dataset_path=None):
        """Train the ML model"""
        logger.info("Starting model training...")
        
        # Prepare training data
        df = self.prepare_training_data(dataset_path)
        
        # Separate features and target
        feature_columns = [col for col in df.columns if col != 'is_ad']
        X = df[feature_columns]
        y = df['is_ad']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train Random Forest model
        self.model = RandomForestClassifier(
            n_estimators=100,
            random_state=42,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2
        )
        
        self.model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        logger.info(f"Model trained with accuracy: {accuracy:.2f}")
        logger.info(f"Training data shape: {X_train.shape}")
        
        # Feature importance
        feature_importance = self.model.feature_importances_
        for i, importance in enumerate(feature_importance):
            logger.info(f"Feature {feature_columns[i]}: {importance:.4f}")
        
        self.is_trained = True
        
        # Save model
        self.save_model()
        
        return accuracy
    
    def predict_ad_probability(self, element_data):
        """Predict probability that an element is an ad"""
        if not self.is_trained:
            logger.warning("Model not trained. Call train_model() first.")
            return 0.5
        
        try:
            features = self.extract_features(element_data)
            feature_vector = [features.get(feature, False) for feature in self.features]
            
            # Reshape for single prediction
            feature_vector = np.array(feature_vector).reshape(1, -1)
            
            # Get probability prediction
            probability = self.model.predict_proba(feature_vector)[0][1]
            return probability
            
        except Exception as e:
            logger.error(f"Error in prediction: {e}")
            return 0.5
    
    def is_ad(self, element_data, threshold=0.7):
        """Classify if element is an ad"""
        probability = self.predict_ad_probability(element_data)
        return probability >= threshold
    
    def save_model(self, model_path='ad_detector_model.pkl'):
        """Save trained model"""
        if self.model:
            joblib.dump(self.model, model_path)
            logger.info(f"Model saved to {model_path}")
    
    def load_model(self, model_path='ad_detector_model.pkl'):
        """Load pre-trained model"""
        try:
            self.model = joblib.load(model_path)
            self.is_trained = True
            logger.info(f"Model loaded from {model_path}")
            return True
        except FileNotFoundError:
            logger.warning(f"Model file not found: {model_path}")
            return False
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            return False
    
    def analyze_youtube_page(self, page_data):
        """Analyze entire YouTube page for ads"""
        results = []
        
        for element in page_data.get('elements', []):
            probability = self.predict_ad_probability(element)
            is_ad = self.is_ad(element, threshold=0.7)
            
            results.append({
                'element_id': element.get('id'),
                'title': element.get('title', ''),
                'is_ad': is_ad,
                'confidence': probability,
                'reasoning': self.get_reasoning(element, probability)
            })
        
        return {
            'total_elements': len(results),
            'ads_detected': sum(1 for r in results if r['is_ad']),
            'analysis_time': datetime.now().isoformat(),
            'results': results
        }
    
    def get_reasoning(self, element_data, probability):
        """Get human-readable reasoning for classification"""
        reasons = []
        
        features = self.extract_features(element_data)
        
        if features['has_ad_keywords']:
            reasons.append("Contains ad keywords")
        if features['has_sponsored_text']:
            reasons.append("Sponsored content detected")
        if features['has_ad_badge']:
            reasons.append("Ad badge present")
        if features['is_promoted']:
            reasons.append("Promoted content")
        if features['video_duration_short'] and features['view_count_low']:
            reasons.append("Short video with low views")
        if features['like_ratio_low'] and features['comment_count_low']:
            reasons.append("Low engagement metrics")
        
        return reasons if reasons else ["No strong ad indicators"]

def main():
    """Main function for testing and training"""
    detector = AdvancedAdDetector()
    
    # Try to load existing model
    if not detector.load_model():
        print("Training new model...")
        accuracy = detector.train_model()
        print(f"Model trained with accuracy: {accuracy:.2f}")
    
    # Test with sample data
    test_element = {
        'title': 'Special Offer - Limited Time Deal!',
        'description': 'Sponsored product advertisement',
        'has_ad_badge': True,
        'is_promoted': True,
        'duration': 15,
        'view_count': 500,
        'like_count': 10,
        'comment_count': 2,
        'channel_verified': False,
        'subscriber_count': 100,
        'upload_frequency': 1
    }
    
    probability = detector.predict_ad_probability(test_element)
    is_ad = detector.is_ad(test_element)
    reasoning = detector.get_reasoning(test_element, probability)
    
    print(f"\nTest Analysis:")
    print(f"Ad Probability: {probability:.2f}")
    print(f"Is Ad: {is_ad}")
    print(f"Reasoning: {', '.join(reasoning)}")

if __name__ == "__main__":
    main()
