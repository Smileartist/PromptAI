import os
import json
from dotenv import load_dotenv

load_dotenv()
info = os.getenv('FIREBASE_SERVICE_ACCOUNT')

try:
    json.loads(info)
    print("SUCCESS")
except Exception as e:
    print(f"FAILED: {e}")
    if hasattr(e, 'pos'):
        pos = e.pos
        start = max(0, pos - 20)
        end = min(len(info), pos + 20)
        print(f"Context: ...{info[start:end]}...")
        print(f"Char at pos: {repr(info[pos])}")
