import sys
import os
from sqlalchemy import create_engine, text
import redis

# Add the current directory to sys.path so we can import from backend
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from config import settings

def test_postgresql():
    print("Testing PostgreSQL (Neon) connection...")
    try:
        engine = create_engine(settings.DATABASE_URL)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version();")).fetchone()
            print("PostgreSQL connection SUCCESSFUL!")
            print(f"PostgreSQL Version: {result[0]}")
            return True
    except Exception as e:
        print(f"PostgreSQL connection FAILED: {e}")
        return False

def test_redis():
    print("Testing Redis connection...")
    try:
        client = redis.from_url(settings.REDIS_URL, decode_responses=True)
        ping_result = client.ping()
        print(f"Redis Ping: {ping_result}")
        if ping_result:
            print("Redis connection SUCCESSFUL!")
            return True
        else:
            print("Redis connection FAILED: Ping returned False")
            return False
    except Exception as e:
        print(f"Redis connection FAILED: {e}")
        return False

if __name__ == "__main__":
    pg_ok = test_postgresql()
    print("-" * 50)
    redis_ok = test_redis()
    print("-" * 50)
    if pg_ok and redis_ok:
        print("ALL CONNECTIONS PASSED!")
    else:
        print("SOME CONNECTIONS FAILED!")
