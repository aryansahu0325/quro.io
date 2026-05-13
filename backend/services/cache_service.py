import redis
import json
from config import settings
from typing import Optional, Any

class CacheService:
    def __init__(self):
        self.client = redis.from_url(settings.REDIS_URL, decode_responses=True)

    def set(self, key: str, value: Any, expire: int = 3600):
        """Store value in cache."""
        if isinstance(value, (dict, list)):
            value = json.dumps(value)
        self.client.set(key, value, ex=expire)

    def get(self, key: str) -> Optional[Any]:
        """Retrieve value from cache."""
        value = self.client.get(key)
        if value:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return value
        return None

    def delete(self, key: str):
        """Remove value from cache."""
        self.client.delete(key)

# Singleton instance
cache_service = CacheService()
