import os
import redis
from celery import Celery

# Load Redis URL from environment, fallback to standard localhost
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Check if Redis is actually accessible to avoid breaking the main app on signup
is_redis_available = False
try:
    r = redis.from_url(REDIS_URL)
    r.ping()
    is_redis_available = True
except Exception:
    pass

celery_app = Celery(
    "quro_worker",
    broker=REDIS_URL if is_redis_available else "memory://",
    backend=REDIS_URL if is_redis_available else None,
    include=["services.email_service"]
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    worker_prefetch_multiplier=1, # Fair dispatching for heavy emails
    task_acks_late=True, # Ensures message isn't lost if worker crashes during send
    task_always_eager=not is_redis_available # Gracefully fall back to synchronous execution if Redis is broken
)

if __name__ == '__main__':
    celery_app.start()
