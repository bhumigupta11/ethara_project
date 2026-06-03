from fastapi.testclient import TestClient
import os, sys
sys.path.insert(0, os.getcwd())
from app.main import app

client = TestClient(app)
email = os.getenv("AUTH_CHECK_EMAIL")
password = os.getenv("AUTH_CHECK_PASSWORD")
if not email or not password:
    raise RuntimeError("Set AUTH_CHECK_EMAIL and AUTH_CHECK_PASSWORD before running this script.")
resp = client.post('/api/auth/login', json={'email': email, 'password': password})
print('status', resp.status_code)
print(resp.text)
