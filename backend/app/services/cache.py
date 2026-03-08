import json
from redis import Redis
from redis.exceptions import RedisError

from app.core.config import get_settings


class CacheService:
    def __init__(self) -> None:
        self._client: Redis | None = None

    def _get_client(self) -> Redis | None:
        if self._client:
            return self._client

        settings = get_settings()
        try:
            self._client = Redis.from_url(settings.redis_url, decode_responses=True)
            self._client.ping()
            return self._client
        except RedisError:
            self._client = None
            return None

    def get_json(self, key: str) -> dict | None:
        client = self._get_client()
        if not client:
            return None

        try:
            value = client.get(key)
            return json.loads(value) if value else None
        except (RedisError, json.JSONDecodeError):
            return None

    def set_json(self, key: str, value: dict, ttl_seconds: int = 3600) -> None:
        client = self._get_client()
        if not client:
            return

        try:
            client.setex(key, ttl_seconds, json.dumps(value))
        except RedisError:
            return


cache_service = CacheService()
