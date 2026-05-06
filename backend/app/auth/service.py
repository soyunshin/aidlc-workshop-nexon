"""Auth service - business logic for authentication."""

from datetime import datetime, timedelta, timezone

from app.auth.repository import AuthRepository
from app.core.config import get_settings
from app.core.exceptions import AuthenticationError, RateLimitError
from app.core.security import create_access_token, verify_password


class AuthService:
    """Service handling authentication business logic."""

    def __init__(self, repo: AuthRepository):
        self.repo = repo
        self.settings = get_settings()

    async def authenticate_admin(
        self,
        store_identifier: str,
        username: str,
        password: str,
    ) -> dict:
        """Authenticate an admin and return JWT token.

        Args:
            store_identifier: Store unique identifier.
            username: Admin username.
            password: Plain text password.

        Returns:
            Dict with access_token and token_type.

        Raises:
            RateLimitError: If too many failed attempts.
            AuthenticationError: If credentials are invalid.
        """
        identifier = f"{store_identifier}:{username}"

        # Check rate limit
        if await self._is_locked_out(identifier):
            raise RateLimitError(
                retry_after=self.settings.login_lockout_minutes * 60
            )

        # Find store
        store = await self.repo.get_store_by_identifier(store_identifier)
        if not store:
            await self._record_attempt(identifier, success=False)
            raise AuthenticationError("Invalid credentials")

        # Find admin
        admin = await self.repo.get_admin_by_credentials(store.id, username)
        if not admin:
            await self._record_attempt(identifier, success=False)
            raise AuthenticationError("Invalid credentials")

        # Verify password
        if not verify_password(password, admin.password_hash):
            await self._record_attempt(identifier, success=False)
            raise AuthenticationError("Invalid credentials")

        # Success
        await self._record_attempt(identifier, success=True)
        token = create_access_token({
            "sub": f"admin_{admin.id}",
            "store_id": store.id,
            "role": "admin",
        })
        return {"access_token": token, "token_type": "bearer"}

    async def authenticate_table(
        self,
        store_identifier: str,
        table_number: int,
        password: str,
    ) -> dict:
        """Authenticate a table and return JWT token.

        Args:
            store_identifier: Store unique identifier.
            table_number: Table number.
            password: Plain text password.

        Returns:
            Dict with access_token and token_type.

        Raises:
            RateLimitError: If too many failed attempts.
            AuthenticationError: If credentials are invalid.
        """
        identifier = f"{store_identifier}:table_{table_number}"

        # Check rate limit
        if await self._is_locked_out(identifier):
            raise RateLimitError(
                retry_after=self.settings.login_lockout_minutes * 60
            )

        # Find store
        store = await self.repo.get_store_by_identifier(store_identifier)
        if not store:
            await self._record_attempt(identifier, success=False)
            raise AuthenticationError("Invalid credentials")

        # Find table
        table = await self.repo.get_table_by_credentials(store.id, table_number)
        if not table:
            await self._record_attempt(identifier, success=False)
            raise AuthenticationError("Invalid credentials")

        # Verify password
        if not verify_password(password, table.password_hash):
            await self._record_attempt(identifier, success=False)
            raise AuthenticationError("Invalid credentials")

        # Success
        await self._record_attempt(identifier, success=True)
        token = create_access_token({
            "sub": f"table_{table.id}",
            "store_id": store.id,
            "table_id": table.id,
            "table_number": table.table_number,
            "role": "table",
        })
        return {"access_token": token, "token_type": "bearer"}

    async def _is_locked_out(self, identifier: str) -> bool:
        """Check if an identifier is locked out due to too many failed attempts."""
        cutoff = datetime.now(timezone.utc) - timedelta(
            minutes=self.settings.login_lockout_minutes
        )
        failed_count = await self.repo.count_failed_attempts(identifier, since=cutoff)
        return failed_count >= self.settings.max_login_attempts

    async def _record_attempt(self, identifier: str, success: bool) -> None:
        """Record a login attempt."""
        await self.repo.record_login_attempt(identifier, success)
