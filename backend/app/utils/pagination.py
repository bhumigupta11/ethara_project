from typing import Optional


def get_pagination_params(skip: Optional[int] = 0, limit: Optional[int] = 20) -> dict:
    return {"skip": max(skip, 0), "limit": min(max(limit, 1), 100)}
