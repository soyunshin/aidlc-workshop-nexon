"""Order router - order API endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import TokenPayload, get_current_admin, get_current_table
from app.menu.repository import MenuRepository
from app.order.repository import OrderRepository
from app.order.schemas import OrderCreate, OrderResponse, OrderStatusUpdate
from app.order.service import OrderService
from app.table.service import TableService
from app.table.repository import TableRepository

router = APIRouter(tags=["orders"])


def _get_order_service(db: AsyncSession = Depends(get_db)) -> OrderService:
    """Dependency to create OrderService."""
    order_repo = OrderRepository(db)
    menu_repo = MenuRepository(db)
    return OrderService(order_repo, menu_repo)


def _get_table_service(db: AsyncSession = Depends(get_db)) -> TableService:
    """Dependency to create TableService."""
    table_repo = TableRepository(db)
    order_repo = OrderRepository(db)
    return TableService(table_repo, order_repo)


# --- Customer Endpoints ---


@router.post("/api/orders", response_model=OrderResponse, status_code=201)
async def create_order(
    data: OrderCreate,
    current_table: TokenPayload = Depends(get_current_table),
    order_service: OrderService = Depends(_get_order_service),
    table_service: TableService = Depends(_get_table_service),
) -> OrderResponse:
    """Create a new order (customer)."""
    # Ensure session exists (auto-start on first order)
    session = await table_service.ensure_session(
        current_table.table_id, current_table.store_id
    )

    order = await order_service.create_order(
        store_id=current_table.store_id,
        table_id=current_table.table_id,
        session_id=session.id,
        data=data,
    )
    return OrderResponse.model_validate(order)


@router.get("/api/orders", response_model=list[OrderResponse])
async def get_my_orders(
    current_table: TokenPayload = Depends(get_current_table),
    order_service: OrderService = Depends(_get_order_service),
    table_service: TableService = Depends(_get_table_service),
) -> list[OrderResponse]:
    """Get orders for current table session (customer)."""
    session = await table_service.get_active_session(current_table.table_id)
    if not session:
        return []
    orders = await order_service.get_orders_by_session(session.id)
    return [OrderResponse.model_validate(o) for o in orders]


# --- Admin Endpoints ---


@router.get("/api/admin/orders", response_model=list[OrderResponse])
async def get_all_orders(
    current_admin: TokenPayload = Depends(get_current_admin),
    order_service: OrderService = Depends(_get_order_service),
) -> list[OrderResponse]:
    """Get all active orders for the store (admin)."""
    orders = await order_service.get_active_orders(current_admin.store_id)
    return [OrderResponse.model_validate(o) for o in orders]


@router.put("/api/admin/orders/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: int,
    data: OrderStatusUpdate,
    current_admin: TokenPayload = Depends(get_current_admin),
    order_service: OrderService = Depends(_get_order_service),
) -> OrderResponse:
    """Update order status (admin)."""
    order = await order_service.update_order_status(
        order_id, current_admin.store_id, data
    )
    return OrderResponse.model_validate(order)


@router.delete("/api/admin/orders/{order_id}", status_code=204)
async def delete_order(
    order_id: int,
    current_admin: TokenPayload = Depends(get_current_admin),
    order_service: OrderService = Depends(_get_order_service),
) -> None:
    """Delete an order (admin)."""
    await order_service.delete_order(order_id, current_admin.store_id)
