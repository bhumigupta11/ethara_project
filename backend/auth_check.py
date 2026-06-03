import asyncio
import os
import sys
sys.path.insert(0, os.getcwd())
from app.database.database import AsyncSessionLocal
from app.services.auth_service import authenticate_user

async def main():
    email = os.getenv("AUTH_CHECK_EMAIL")
    password = os.getenv("AUTH_CHECK_PASSWORD")
    if not email or not password:
        raise RuntimeError("Set AUTH_CHECK_EMAIL and AUTH_CHECK_PASSWORD before running this script.")
    async with AsyncSessionLocal() as session:
        user = await authenticate_user(session, email, password)
        print('auth result', bool(user))
        if user:
            print(user.email, user.role)

asyncio.run(main())
