"""Table repository - database access for table and session management."""

from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.table import Table, TableSession


class TableRepository:
    """Repository for table-related database operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_table(self, table: Table) -> Table:
        """Create a new table."""
        self.db.add(table)
        await self.db.flush()
        await self.db.refresh(table)
        return table

    async def get_table_by_id(self, table_id: int) -> Table | None:
        """Get a table by ID."""
        result = await self.db.execute(
            select(Table).where(Table.id == table_id)
        )
        return result.scalar_one_or_none()

    async def find_tables_by_store(self, store_id: int) -> list[Table]:
        """Get all tables for a store."""
        result = await self.db.execute(
            select(Table)
            .where(Table.store_id == store_id)
            .order_by(Table.table_number)
        )
        return list(result.scalars().all())

    async def get_active_session(self, table_id: int) -> TableSession | None:
        """Get the active session for a table."""
        result = await self.db.execute(
            select(TableSession).where(
                TableSession.table_id == table_id,
                TableSession.is_active == True,  # noqa: E712
            )
        )
        return result.scalar_one_or_none()

    async def create_session(
        self, table_id: int, store_id: int
    ) -> TableSession:
        """Create a new table session."""
        session = TableSession(
            table_id=table_id,
            store_id=store_id,
            is_active=True,
        )
        self.db.add(session)
        await self.db.flush()
        await self.db.refresh(session)

        # Update table's current_session_id
        table = await self.get_table_by_id(table_id)
        if table:
            table.current_session_id = session.id
            await self.db.flush()

        return session

    async def close_session(self, session: TableSession) -> None:
        """Close a table session."""
        session.is_active = False
        session.ended_at = datetime.now(timezone.utc)
        await self.db.flush()

        # Clear table's current_session_id
        table = await self.get_table_by_id(session.table_id)
        if table:
            table.current_session_id = None
            await self.db.flush()

    async def find_closed_sessions(
        self, table_id: int, date_from: datetime | None = None
    ) -> list[TableSession]:
        """Get closed sessions for a table, optionally filtered by date."""
        query = select(TableSession).where(
            TableSession.table_id == table_id,
            TableSession.is_active == False,  # noqa: E712
        ).order_by(TableSession.ended_at.desc())

        if date_from:
            query = query.where(TableSession.ended_at >= date_from)

        result = await self.db.execute(query)
        return list(result.scalars().all())
