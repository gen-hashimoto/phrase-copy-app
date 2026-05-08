"""SQLAlchemy の Declarative ベース。"""
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """全モデルの共通基底。"""

    pass
