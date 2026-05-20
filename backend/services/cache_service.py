import redis
import json
import time
import logging
import threading
from config import settings
from typing import Optional, Any

logger = logging.getLogger("quro.cache")

class CacheService:
    def __init__(self):
        self.redis_url = settings.REDIS_URL
        self.use_fallback = False
        self.client = None
        self._local_cache = {}
        self._lock = threading.Lock()
        
        logger.info(f"Initializing CacheService with Redis URL: {self.redis_url}")
        try:
            # Create redis client
            self.client = redis.from_url(self.redis_url, decode_responses=True, socket_timeout=3.0)
            # Test connection immediately
            self.client.ping()
            logger.info("Successfully connected to Redis Cloud!")
        except Exception as e:
            self.use_fallback = True
            logger.warning(
                f"Redis connection failed: {e}. "
                "Degrading gracefully to thread-safe in-memory fallback cache."
            )

    def set(self, key: str, value: Any, expire: int = 3600):
        """Store value in cache with expiration (TTL)."""
        # Serialize dictionaries or lists to JSON string
        serialized_val = json.dumps(value) if isinstance(value, (dict, list)) else value
        
        if not self.use_fallback:
            try:
                self.client.set(key, serialized_val, ex=expire)
                return
            except Exception as e:
                logger.error(f"Redis set failed for key '{key}': {e}. Falling back to in-memory.")
                # Don't throw, just fall back
        
        # In-memory fallback caching
        expires_at = time.time() + expire
        with self._lock:
            self._local_cache[key] = {
                "value": serialized_val,
                "expires_at": expires_at
            }

    def get(self, key: str) -> Optional[Any]:
        """Retrieve value from cache with expiration (TTL) checks."""
        if not self.use_fallback:
            try:
                value = self.client.get(key)
                if value is not None:
                    return self._deserialize(value)
                return None
            except Exception as e:
                logger.error(f"Redis get failed for key '{key}': {e}. Falling back to in-memory.")
        
        # In-memory fallback retrieving
        with self._lock:
            cached = self._local_cache.get(key)
            if not cached:
                return None
            
            # Expiry check
            if time.time() > cached["expires_at"]:
                del self._local_cache[key]
                return None
            
            return self._deserialize(cached["value"])

    def delete(self, key: str):
        """Remove value from cache."""
        if not self.use_fallback:
            try:
                self.client.delete(key)
                return
            except Exception as e:
                logger.error(f"Redis delete failed for key '{key}': {e}. Falling back to in-memory.")
        
        with self._lock:
            if key in self._local_cache:
                del self._local_cache[key]

    def _deserialize(self, value: Any) -> Any:
        """Helper to deserialize stored JSON strings back into objects."""
        if isinstance(value, str):
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return value
        return value

# Singleton instance
cache_service = CacheService()
