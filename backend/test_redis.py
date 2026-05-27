from app.core.redis import redis_client

try:
    redis_client.ping()
    print("Redis connected successfully")

except Exception as e:
    print(e)