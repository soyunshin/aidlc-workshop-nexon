"""Table service - business logic for table and session management."""

from app.core.exceptions import ConflictError, NotFoundError
from app.core.security import hash_password
from app.models.table import Table, TableSession
from app.order.repository import OrderRepository
from app.table.repository import TableRepository
from app.table.schemas import TableSetup


class TableService:
    """Service handling table and session business logic."""

    def __init__(self, table_repo: TableRepository, order_repo: OrderRepository):
        self.table_repo = table_repo
        self.order_repo = order_repo

    async def setup_table(self, store_id: int, data: TableSetup) -> Table:
        """Set up a new table with number and password."""
        table = Table(
            store_id=store_id,
            table_number=data.table_number,
            password_hash=hash_password(data.password),
        )
        return await self.table_repo.create_table(table)

    async def get_tables(self, store_id: int) -> list[Table]:
        """Get all tables for a store."""
        return await self.table_repo.find_tables_by_store(store_id)

    async def get_active_session(self, table_id: int) -> TableSession | None:
        """Get the active session for a table."""
        return await self.table_repo.get_active_session(table_id)

    async def ensure_session(
        self, table_id: int, store_id: int
    ) -> TableSession:
        """Ensure a table has an active session (create if needed).

        Called on first order - auto-starts session per FR-08-03.
        """
        session = await self.table_repo.get_active_session(table_id)
        if session:
            return session
        return await self.table_repo.create_session(table_id, store_id)

    async def complete_session(self, table_id: int, store_id: int) -> None:
        """Complete a table session (admin action).

        Archives all orders and closes the session.
        """
        table = await self.table_repo.get_table_by_id(table_id)
        if not table or table.store_id != store_id:
            raise NotFoundError("Table not found")

        session = await self.table_repo.get_active_session(table_id)
        if not session:
            raise ConflictError("No active session for this table")

        # Archive all orders in this session
        await self.order_repo.archive_session_orders(session.id)

        # Close the session
        await self.table_repo.close_session(session)

    async def get_table_total(self, table_id: int) -> int:
        """Get total order amount for the active session."""
        session = await self.table_repo.get_active_session(table_id)
        if not session:
            return 0
        return await self.order_repo.calculate_session_total(session.id)
