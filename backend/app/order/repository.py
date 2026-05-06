"""Order repository - database access for orders."""

from datetime import datetime, timezone

from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.order import Order, OrderItem, OrderStatus


class OrderRepository:
    """Repository for order-related database operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_order(self, order: Order) -> Order:
        """Create a new order with items."""
        self.db.add(order)
        await self.db.flush()
        await self.db.refresh(order, attribute_names=["items"])
        return order

    async def get_order_by_id(self, order_id: int) -> Order | None:
        """Get an order by ID with items loaded."""
        result = await self.db.execute(
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.id == order_id)
        )
        return result.scalar_one_or_none()

    async def find_orders_by_session(
        self, session_id: int, include_archived: bool = False
    ) -> list[Order]:
        """Get orders for a session."""
        query = (
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.session_id == session_id)
            .order_by(Order.ordered_at.desc())
        )
        if not include_archived:
            query = query.where(Order.is_archived == False)  # noqa: E712
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def find_active_orders(self, store_id: int) -> list[Order]:
        """Get all non-archived orders for a store."""
        result = await self.db.execute(
            select(Order)
            .options(selectinload(Order.items))
            .where(
                Order.store_id == store_id,
                Order.is_archived == False,  # noqa: E712
            )
            .order_by(Order.ordered_at.desc())
        )
        return list(result.scalars().all())

    async def update_order_status(
        self, order_id: int, status: OrderStatus
    ) -> Order | None:
        """Update order status."""
        order = await self.get_order_by_id(order_id)
        if order:
            order.status = status
            await self.db.flush()
            await self.db.refresh(order)
        return order

    async def delete_order(self, order: Order) -> None:
        """Delete an order and its items (cascade)."""
        await self.db.delete(order)
        await self.db.flush()

    async def archive_session_orders(self, session_id: int) -> None:
        """Mark all orders in a session as archived."""
        await self.db.execute(
            update(Order)
            .where(Order.session_id == session_id)
            .values(is_archived=True)
        )
        await self.db.flush()

    async def get_next_order_number(self, store_id: int) -> str:
        """Generate next order number for today (YYYYMMDD-NNNN)."""
        today = datetime.now(timezone.utc).strftime("%Y%m%d")
        prefix = f"{today}-"

        result = await self.db.execute(
            select(func.count(Order.id)).where(
                Order.store_id == store_id,
                Order.order_number.like(f"{prefix}%"),
            )
        )
        count = result.scalar_one()
        return f"{prefix}{count + 1:04d}"

    async def calculate_session_total(self, session_id: int) -> int:
        """Calculate total amount for all non-archived orders in a session."""
        result = await self.db.execute(
            select(func.coalesce(func.sum(Order.total_amount), 0)).where(
                Order.session_id == session_id,
                Order.is_archived == False,  # noqa: E712
            )
        )
        return result.scalar_one()
