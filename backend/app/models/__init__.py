"""SQLAlchemy models package."""

from datetime import datetime

from sqlalchemy import DateTime, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""

    pass


class TimestampMixin:
    """Mixin that adds created_at and updated_at columns."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )


# Import all models so Alembic can detect them
from app.models.store import Store  # noqa: E402, F401
from app.models.admin import Admin  # noqa: E402, F401
from app.models.table import Table, TableSession  # noqa: E402, F401
from app.models.menu import Category, MenuItem  # noqa: E402, F401
from app.models.order import Order, OrderItem  # noqa: E402, F401
from app.models.login_attempt import LoginAttempt  # noqa: E402, F401
