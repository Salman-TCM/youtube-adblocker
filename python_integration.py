#!/usr/bin/env python3
"""
Python Integration Service for YouTube Ad Blocker Pro
Provides ML-based ad detection as a service for the Chrome extension
"""

import json
import sys
import os
import threading
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import logging

from ml_detector import AdvancedAdDetector

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AdDetectionAPI(BaseHTTPRequestHandler):
    """HTTP API for ad detection service"""
    
    def __init__(self, *args, **kwargs):
        self.detector = None
        self.model_loaded = False
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/health':
            self.send_health_check()
        elif parsed_path.path == '/analyze':
            self.handle_analysis(parsed_path)
        elif parsed_path.path == '/train':
            self.handle_training()
        else:
            self.send_error(404, "Endpoint not found")
    
    def do_POST(self):
        """Handle POST requests for analysis"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/analyze':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            self.analyze_element(post_data)
        elif parsed_path.path == '/batch_analyze':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            self.analyze_batch(post_data)
        else:
            self.send_error(404, "Endpoint not found")
    
    def send_health_check(self):
        """Send health check response"""
        response = {
            'status': 'healthy',
            'model_loaded': self.model_loaded,
            'service': 'YouTube Ad Blocker Pro ML Service'
        }
        self.send_json_response(200, response)
    
    def handle_analysis(self, parsed_path):
        """Handle analysis with query parameters"""
        query_params = parse_qs(parsed_path.query)
        
        # Initialize detector if not loaded
        if not self.model_loaded:
            self.initialize_detector()
        
        # Extract element data from query
        element_data = {}
        for key, values in query_params.items():
            if values and len(values) > 0:
                element_data[key] = values[0]
        
        # Perform analysis
        if element_data:
            try:
                probability = self.detector.predict_ad_probability(element_data)
                is_ad = self.detector.is_ad(element_data)
                reasoning = self.detector.get_reasoning(element_data, probability)
                
                response = {
                    'is_ad': is_ad,
                    'confidence': probability,
                    'reasoning': reasoning,
                    'timestamp': time.time()
                }
                
                self.send_json_response(200, response)
            except Exception as e:
                logger.error(f"Analysis error: {e}")
                self.send_json_response(500, {'error': str(e)})
        else:
            self.send_error(400, "No element data provided")
    
    def analyze_element(self, post_data):
        """Analyze element from POST data"""
        try:
            element_data = json.loads(post_data.decode('utf-8'))
            
            if not self.model_loaded:
                self.initialize_detector()
            
            probability = self.detector.predict_ad_probability(element_data)
            is_ad = self.detector.is_ad(element_data)
            reasoning = self.detector.get_reasoning(element_data, probability)
            
            response = {
                'is_ad': is_ad,
                'confidence': probability,
                'reasoning': reasoning,
                'timestamp': time.time()
            }
            
            self.send_json_response(200, response)
            
        except json.JSONDecodeError:
            self.send_error(400, "Invalid JSON data")
        except Exception as e:
            logger.error(f"Analysis error: {e}")
            self.send_json_response(500, {'error': str(e)})
    
    def analyze_batch(self, post_data):
        """Analyze multiple elements"""
        try:
            batch_data = json.loads(post_data.decode('utf-8'))
            elements = batch_data.get('elements', [])
            
            if not self.model_loaded:
                self.initialize_detector()
            
            results = []
            for element_data in elements:
                try:
                    probability = self.detector.predict_ad_probability(element_data)
                    is_ad = self.detector.is_ad(element_data)
                    reasoning = self.detector.get_reasoning(element_data, probability)
                    
                    results.append({
                        'element_id': element_data.get('id'),
                        'is_ad': is_ad,
                        'confidence': probability,
                        'reasoning': reasoning
                    })
                except Exception as e:
                    results.append({
                        'element_id': element_data.get('id'),
                        'error': str(e)
                    })
            
            response = {
                'total_elements': len(elements),
                'ads_detected': sum(1 for r in results if r.get('is_ad', False)),
                'results': results,
                'timestamp': time.time()
            }
            
            self.send_json_response(200, response)
            
        except json.JSONDecodeError:
            self.send_error(400, "Invalid JSON data")
        except Exception as e:
            logger.error(f"Batch analysis error: {e}")
            self.send_json_response(500, {'error': str(e)})
    
    def handle_training(self):
        """Handle model training request"""
        try:
            if self.detector:
                accuracy = self.detector.train_model()
                self.model_loaded = True
                
                response = {
                    'status': 'training_complete',
                    'accuracy': accuracy,
                    'timestamp': time.time()
                }
                
                self.send_json_response(200, response)
            else:
                self.send_error(500, "Detector not initialized")
                
        except Exception as e:
            logger.error(f"Training error: {e}")
            self.send_json_response(500, {'error': str(e)})
    
    def initialize_detector(self):
        """Initialize the ML detector"""
        try:
            if not self.detector:
                self.detector = AdvancedAdDetector()
            
            # Try to load existing model
            if not self.model_loaded:
                self.model_loaded = self.detector.load_model()
                
            # Train new model if not loaded
            if not self.model_loaded:
                logger.info("Training new model...")
                accuracy = self.detector.train_model()
                self.model_loaded = True
                logger.info(f"Model trained with accuracy: {accuracy:.2f}")
                
        except Exception as e:
            logger.error(f"Detector initialization error: {e}")
            self.model_loaded = False
    
    def send_json_response(self, status_code, data):
        """Send JSON response"""
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        json_data = json.dumps(data, indent=2)
        self.wfile.write(json_data.encode('utf-8'))
    
    def log_message(self, format, *args):
        """Override to reduce log spam"""
        pass  # Disable default logging

class AdDetectionService:
    """Main service class for running the ML server"""
    
    def __init__(self, host='localhost', port=8080):
        self.host = host
        self.port = port
        self.server = None
        self.server_thread = None
        
    def start_service(self):
        """Start the ML detection service"""
        try:
            # Create custom handler with detector
            handler = type('MLHandler', (AdDetectionAPI,), {})
            self.server = HTTPServer((self.host, self.port), handler)
            
            # Start in separate thread
            self.server_thread = threading.Thread(target=self.server.serve_forever)
            self.server_thread.daemon = True
            self.server_thread.start()
            
            logger.info(f"ML Detection Service started on {self.host}:{self.port}")
            logger.info("API Endpoints:")
            logger.info("  GET  /health - Health check")
            logger.info("  GET  /analyze - Analyze single element (query params)")
            logger.info("  POST /analyze - Analyze single element (JSON)")
            logger.info("  POST /batch_analyze - Analyze multiple elements")
            logger.info("  GET  /train - Train new model")
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to start service: {e}")
            return False
    
    def stop_service(self):
        """Stop the ML detection service"""
        if self.server:
            self.server.shutdown()
            logger.info("ML Detection Service stopped")
    
    def is_running(self):
        """Check if service is running"""
        return self.server_thread and self.server_thread.is_alive()

def main():
    """Main function to run the service"""
    import argparse
    
    parser = argparse.ArgumentParser(description='YouTube Ad Blocker Pro ML Service')
    parser.add_argument('--host', default='localhost', help='Host to bind to')
    parser.add_argument('--port', type=int, default=8080, help='Port to bind to')
    parser.add_argument('--daemon', action='store_true', help='Run as daemon')
    
    args = parser.parse_args()
    
    # Create and start service
    service = AdDetectionService(args.host, args.port)
    
    if service.start_service():
        try:
            if args.daemon:
                # Run indefinitely
                while True:
                    time.sleep(1)
            else:
                print(f"ML Service running on {args.host}:{args.port}")
                print("Press Ctrl+C to stop...")
                
                # Keep main thread alive
                while service.is_running():
                    time.sleep(1)
                    
        except KeyboardInterrupt:
            print("\nShutting down service...")
            service.stop_service()
    else:
        print("Failed to start service")
        sys.exit(1)

if __name__ == "__main__":
    main()
