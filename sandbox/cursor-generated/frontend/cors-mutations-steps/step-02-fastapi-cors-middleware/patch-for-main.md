# `backend/app/main.py` に足す見本

`app = FastAPI()` の**直後**（`include_router` の前でも後でもよいが、ルーター前が読みやすい）に追加する。

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

- フロントの URL が違う場合は `allow_origins` を合わせる。
- 本番では `["*"]` や緩い設定は避け、**必要なオリジンだけ**に絞る。
