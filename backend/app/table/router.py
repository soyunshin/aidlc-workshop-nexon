"""Table router - table management API endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import TokenPayload, get_current_admin
from app.order.repository import OrderRepository
from app.table.repository import TableRepository
from app.table.schemas import TableResponse, TableSetup
from app.table.service import TableService

router = APIRouter(tags=["tables"])


def _get_table_service(db: AsyncSession = Depends(get_db)) -> TableService:
    """Dependency to create TableService."""
    table_repo = TableRepository(db)
    order_repo = OrderRepository(db)
    return TableService(table_repo, order_repo)


@router.post("/api/admin/tables", response_model=TableResponse, status_code=201)
async def setup_table(
    data: TableSetup,
    current_admin: TokenPayload = Depends(get_current_admin),
    service: TableService = Depends(_get_table_service),
) -> TableResponse:
    """Set up a new table (admin)."""
    table = await service.setup_table(current_admin.store_id, data)
    return TableResponse(
        id=table.id,
        table_number=table.table_number,
        has_active_session=False,
        total_amount=0,
    )


@router.get("/api/admin/tables", response_model=list[TableResponse])
async def get_tables(
    current_admin: TokenPayload = Depends(get_current_admin),
    service: TableService = Depends(_get_table_service),
) -> list[TableResponse]:
    """Get all tables with session status (admin)."""
    tables = await service.get_tables(current_admin.store_id)
    result = []
    for table in tables:
        total = await service.get_table_total(table.id)
        result.append(TableResponse(
            id=table.id,
            table_number=table.table_number,
            has_active_session=table.current_session_id is not None,
            total_amount=total,
        ))
    return result


@router.post("/api/admin/tables/{table_id}/complete", status_code=204)
async def complete_table_session(
    table_id: int,
    current_admin: TokenPayload = Depends(get_current_admin),
    service: TableService = Depends(_get_table_service),
) -> None:
    """Complete a table session - archive orders and reset (admin)."""
    await service.complete_session(table_id, current_admin.store_id)


@router.get("/api/admin/tables/{table_id}/history")
async def get_table_history(
    table_id: int,
    current_admin: TokenPayload = Depends(get_current_admin),
    service: TableService = Depends(_get_table_service),
    db: AsyncSession = Depends(get_db),
) -> list[dict]:
    """Get past order history for a table (admin)."""
    from app.order.repository import OrderRepository

    order_repo = OrderRepository(db)
    table_repo = TableRepository(db)

    # Get closed sessions
    sessions = await table_repo.find_closed_sessions(table_id)
    history = []

    for session in sessions:
        orders = await order_repo.find_orders_by_session(
            session.id, include_archived=True
        )
        for order in orders:
            history.append({
                "order_number": order.order_number,
                "total_amount": order.total_amount,
                "ordered_at": order.ordered_at.isoformat(),
                "status": order.status.value,
                "items_count": len(order.items),
            })

    return history
