import json
import redis
from typing import List, Optional

redis_client = redis.Redis(
    host="127.0.0.1",
    port=6379,
    db=0,
    decode_responses=True
)


def key(user_id: str):
    return f"user_permissions:{user_id}"


def get(user_id: str) -> Optional[List[str]]:
    try:
        data = redis_client.get(key(user_id))
        return json.loads(data) if data else None
    except:
        return None


def set(user_id: str, permissions: List[str], ttl: int = 3600):
    try:
        redis_client.setex(key(user_id), ttl, json.dumps(permissions))
    except:
        pass


def clear(user_id: str):
    try:
        redis_client.delete(key(user_id))
    except:
        pass