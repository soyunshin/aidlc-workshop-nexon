"""Table and TableSession models."""

from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base, TimestampMixin


class TableSession(Base, TimestampMixin):
    """Table session - represents a customer's visit from first order to checkout."""

    __tablename__ = "table_sessions"
    __table_args__ = (
        Index("ix_table_sessions_table_active", "table_id", "is_active"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    table_id: Mapped[int] = mapped_column(
        ForeignKey("tables.id", ondelete="RESTRICT"), nullable=False
    )
    store_id: Mapped[int] = mapped_column(
        ForeignKey("stores.id", ondelete="RESTRICT"), nullable=False
    )
    started_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now()
    )
    ended_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    is_active: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default="1"
    )

    # Relationships
    table = relationship("Table", back_populates="sessions", foreign_keys=[table_id])
    orders = relationship("Order", back_populates="session", lazy="selectin")


class Table(Base, TimestampMixin):
    """Table entity - a physical table in the restaurant."""

    __tablename__ = "tables"
    __table_args__ = (
        UniqueConstraint("store_id", "table_number", name="uq_table_store_number"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    store_id: Mapped[int] = mapped_column(
        ForeignKey("stores.id", ondelete="RESTRICT"), nullable=False
    )
    table_number: Mapped[int] = mapped_column(Integer, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    current_session_id: Mapped[int | None] = mapped_column(
        ForeignKey("table_sessions.id", ondelete="SET NULL"), nullable=True
    )

    # Relationships
    store = relationship("Store", back_populates="tables")
    sessions = relationship(
        "TableSession",
        back_populates="table",
        foreign_keys=[TableSession.table_id],
        lazy="selectin",
    )
    current_session = relationship(
        "TableSession",
        foreign_keys=[current_session_id],
        uselist=False,
        lazy="joined",
    )
