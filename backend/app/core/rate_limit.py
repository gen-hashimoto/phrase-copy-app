import time
from threading import Lock
from fastapi import Request

# Module-level store: key->list of monotonic timestamp
_store: dict[str, list[float]] = {}
_lock = Lock()


def check_rate_limit(key: str, *, max_count: int, window_seconds: int) -> bool:
    """Return True if allowed, False if rate limited."""
    now = time.monotonic()
    with _lock:
        timestamps = _store.get(key, [])
        cutoff = now - window_seconds
        timestamps = [t for t in timestamps if t > cutoff]
        if len(timestamps) >= max_count:
            _store[key] = timestamps
            return False
        timestamps.append(now)
        _store[key] = timestamps
        return True


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "unkonwn"
