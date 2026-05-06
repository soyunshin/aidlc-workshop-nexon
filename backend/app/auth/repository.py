"""Auth repository - database access for authentication."""

from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.admin import Admin
from app.models.login_attempt import LoginAttempt
from app.models.store import Store
from app.models.table import Table


class AuthRepository:
    """Repository for authentication-related database operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_store_by_identifier(self, store_identifier: str) -> Store | None:
        """Find a store by its unique identifier."""
        result = await self.db.execute(
            select(Store).where(Store.store_identifier == store_identifier)
        )
        return result.scalar_one_or_none()

    async def get_admin_by_credentials(
        self, store_id: int, username: str
    ) -> Admin | None:
        """Find an admin by store_id and username."""
        result = await self.db.execute(
            select(Admin).where(
                Admin.store_id == store_id,
                Admin.username == username,
            )
        )
        return result.scalar_one_or_none()

    async def get_table_by_credentials(
        self, store_id: int, table_number: int
    ) -> Table | None:
        """Find a table by store_id and table_number."""
        result = await self.db.execute(
            select(Table).where(
                Table.store_id == store_id,
                Table.table_number == table_number,
            )
        )
        return result.scalar_one_or_none()

    async def count_failed_attempts(
        self, identifier: str, since: datetime
    ) -> int:
        """Count failed login attempts for an identifier since a given time."""
        result = await self.db.execute(
            select(func.count(LoginAttempt.id)).where(
                LoginAttempt.identifier == identifier,
                LoginAttempt.success == False,  # noqa: E712
                LoginAttempt.attempted_at > since,
            )
        )
        return result.scalar_one()

    async def record_login_attempt(
        self, identifier: str, success: bool
    ) -> None:
        """Record a login attempt (success or failure)."""
        attempt = LoginAttempt(identifier=identifier, success=success)
        self.db.add(attempt)
        await self.db.flush()
