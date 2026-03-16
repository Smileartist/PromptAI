import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

def initialize_firebase():
    try:
        if not firebase_admin._apps:
            # Check if we have the service account JSON in environment variables
            service_account_info = os.getenv('FIREBASE_SERVICE_ACCOUNT')
            
            if service_account_info:
                try:
                    # If it's a JSON string
                    cred_dict = json.loads(service_account_info)
                    cred = credentials.Certificate(cred_dict)
                except (json.JSONDecodeError, ValueError) as e:
                    print(f"DEBUG: JSON load failed: {str(e)}")
                    # If it's a path to a file
                    cred = credentials.Certificate(service_account_info)
            else:
                # Fallback to default credentials (e.g. if running on GCP/Firebase)
                # or try to look for a default file
                default_path = 'firebase-service-account.json'
                if os.path.exists(default_path):
                    cred = credentials.Certificate(default_path)
                else:
                    # For local development without service account, we might want to use the emulator
                    # but for now we'll just raise an error or use application default
                    try:
                        cred = credentials.ApplicationDefault()
                    except Exception:
                        print("Warning: Firebase credentials not found. Set FIREBASE_SERVICE_ACCOUNT.")
                        return None

            firebase_admin.initialize_app(cred)
        
        return firestore.client()
    except Exception as e:
        print(f"Warning: Failed to initialize Firebase/Firestore: {str(e)}")
        return None

# Global db client
db = initialize_firebase()
