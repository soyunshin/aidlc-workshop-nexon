"""Order service - business logic for order management."""

from app.core.exceptions import NotFoundError, ValidationError
from app.menu.repository import MenuRepository
from app.models.order import VALID_STATUS_TRANSITIONS, Order, OrderItem, OrderStatus
from app.order.repository import OrderRepository
from app.order.schemas import OrderCreate, OrderStatusUpdate


class OrderService:
    """Service handling order business logic."""

    def __init__(self, order_repo: OrderRepository, menu_repo: MenuRepository):
        self.order_repo = order_repo
        self.menu_repo = menu_repo

    async def create_order(
        self,
        store_id: int,
        table_id: int,
        session_id: int,
        data: OrderCreate,
    ) -> Order:
        """Create a new order.

        Validates menu items exist and calculates totals from current prices.
        """
        order_items = []
        total_amount = 0

        for item_data in data.items:
            menu_item = await self.menu_repo.get_menu_item_by_id(item_data.menu_item_id)
            if not menu_item or menu_item.store_id != store_id:
                raise ValidationError(
                    f"Menu item {item_data.menu_item_id} not found"
                )
            if not menu_item.is_available:
                raise ValidationError(
                    f"Menu item '{menu_item.name}' is not available"
                )

            subtotal = menu_item.price * item_data.quantity
            total_amount += subtotal

            order_items.append(
                OrderItem(
                    menu_item_id=menu_item.id,
                    item_name=menu_item.name,
                    unit_price=menu_item.price,
                    quantity=item_data.quantity,
                    subtotal=subtotal,
                )
            )

        order_number = await self.order_repo.get_next_order_number(store_id)

        order = Order(
            store_id=store_id,
            table_id=table_id,
            session_id=session_id,
            order_number=order_number,
            total_amount=total_amount,
            items=order_items,
        )

        return await self.order_repo.create_order(order)

    async def get_orders_by_session(self, session_id: int) -> list[Order]:
        """Get all active orders for a session."""
        return await self.order_repo.find_orders_by_session(session_id)

    async def get_active_orders(self, store_id: int) -> list[Order]:
        """Get all active (non-archived) orders for a store."""
        return await self.order_repo.find_active_orders(store_id)

    async def update_order_status(
        self, order_id: int, store_id: int, data: OrderStatusUpdate
    ) -> Order:
        """Update order status with transition validation."""
        order = await self.order_repo.get_order_by_id(order_id)
        if not order or order.store_id != store_id:
            raise NotFoundError("Order not found")

        # Validate status transition
        allowed = VALID_STATUS_TRANSITIONS.get(order.status, [])
        if data.status not in allowed:
            raise ValidationError(
                f"Cannot transition from '{order.status.value}' to '{data.status.value}'"
            )

        order = await self.order_repo.update_order_status(order_id, data.status)
        return order

    async def delete_order(self, order_id: int, store_id: int) -> None:
        """Delete an order (admin only)."""
        order = await self.order_repo.get_order_by_id(order_id)
        if not order or order.store_id != store_id:
            raise NotFoundError("Order not found")

        await self.order_repo.delete_order(order)

    async def calculate_table_total(self, session_id: int) -> int:
        """Calculate total amount for a table session."""
        return await self.order_repo.calculate_session_total(session_id)
