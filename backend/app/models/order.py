"""Order and OrderItem models."""

from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base, TimestampMixin


class OrderStatus(str, PyEnum):
    """Order status enum."""

    PENDING = "pending"
    PREPARING = "preparing"
    COMPLETED = "completed"


# Valid status transitions (single direction only)
VALID_STATUS_TRANSITIONS: dict[str, list[str]] = {
    OrderStatus.PENDING: [OrderStatus.PREPARING],
    OrderStatus.PREPARING: [OrderStatus.COMPLETED],
    OrderStatus.COMPLETED: [],
}


class Order(Base, TimestampMixin):
    """Order entity."""

    __tablename__ = "orders"
    __table_args__ = (
        CheckConstraint("total_amount >= 0", name="ck_orders_total_positive"),
        Index("ix_orders_session_archived", "session_id", "is_archived"),
        Index("ix_orders_store_archived_time", "store_id", "is_archived", "ordered_at"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    store_id: Mapped[int] = mapped_column(
        ForeignKey("stores.id", ondelete="RESTRICT"), nullable=False
    )
    table_id: Mapped[int] = mapped_column(
        ForeignKey("tables.id", ondelete="RESTRICT"), nullable=False
    )
    session_id: Mapped[int] = mapped_column(
        ForeignKey("table_sessions.id", ondelete="RESTRICT"), nullable=False
    )
    order_number: Mapped[str] = mapped_column(
        String(20), nullable=False, unique=True
    )
    status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus, values_callable=lambda x: [e.value for e in x]),
        nullable=False,
        server_default=OrderStatus.PENDING.value,
    )
    total_amount: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    ordered_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now()
    )
    is_archived: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default="0"
    )

    # Relationships
    session = relationship("TableSession", back_populates="orders")
    items = relationship(
        "OrderItem", back_populates="order", lazy="selectin", cascade="all, delete-orphan"
    )


class OrderItem(Base):
    """Order item entity - snapshot of menu item at order time."""

    __tablename__ = "order_items"
    __table_args__ = (
        CheckConstraint("unit_price >= 0", name="ck_order_items_price_positive"),
        CheckConstraint("quantity > 0", name="ck_order_items_quantity_positive"),
        CheckConstraint("subtotal >= 0", name="ck_order_items_subtotal_positive"),
        Index("ix_order_items_order", "order_id"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"), nullable=False
    )
    menu_item_id: Mapped[int | None] = mapped_column(
        ForeignKey("menu_items.id", ondelete="SET NULL"), nullable=True
    )
    item_name: Mapped[str] = mapped_column(String(100), nullable=False)
    unit_price: Mapped[int] = mapped_column(Integer, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    subtotal: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now()
    )

    # Relationships
    order = relationship("Order", back_populates="items")
