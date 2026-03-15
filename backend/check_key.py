import os
# Check BEFORE dotenv loads
key_before = os.environ.get('OPENAI_API_KEY', 'NOT SET')
print(f"System env (before dotenv): {key_before[:20] if key_before != 'NOT SET' else key_before}")

from dotenv import load_dotenv
load_dotenv(override=True)

key_after = os.environ.get('OPENAI_API_KEY', 'NOT SET')
print(f"After dotenv (override=True): {key_after[:20] if key_after != 'NOT SET' else key_after}")
