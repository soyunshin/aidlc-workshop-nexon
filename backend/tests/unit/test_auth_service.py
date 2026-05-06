"""Unit tests for AuthService business logic."""

from datetime import datetime, timedelta, timezone
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.auth.service import AuthService
from app.core.exceptions import AuthenticationError, RateLimitError
from app.core.security import hash_password


@pytest.fixture
def mock_repo():
    """Create a mock AuthRepository."""
    repo = AsyncMock()
    repo.count_failed_attempts = AsyncMock(return_value=0)
    repo.record_login_attempt = AsyncMock()
    return repo


@pytest.fixture
def auth_service(mock_repo):
    """Create AuthService with mock repository."""
    with patch("app.auth.service.get_settings") as mock_settings:
        mock_settings.return_value.max_login_attempts = 5
        mock_settings.return_value.login_lockout_minutes = 15
        mock_settings.return_value.secret_key = "test-secret-key-32-chars-minimum!"
        mock_settings.return_value.jwt_algorithm = "HS256"
        mock_settings.return_value.jwt_expire_hours = 16
        service = AuthService(mock_repo)
    return service


class TestAuthenticateAdmin:
    """Tests for admin authentication."""

    @pytest.mark.asyncio
    async def test_successful_login(self, auth_service, mock_repo):
        """Successful admin login should return token."""
        mock_store = MagicMock(id=1, store_identifier="store001")
        mock_admin = MagicMock(id=1, password_hash=hash_password("correct"))
        mock_repo.get_store_by_identifier = AsyncMock(return_value=mock_store)
        mock_repo.get_admin_by_credentials = AsyncMock(return_value=mock_admin)

        result = await auth_service.authenticate_admin("store001", "admin", "correct")

        assert "access_token" in result
        assert result["token_type"] == "bearer"
        mock_repo.record_login_attempt.assert_called()

    @pytest.mark.asyncio
    async def test_invalid_store(self, auth_service, mock_repo):
        """Non-existent store should raise AuthenticationError."""
        mock_repo.get_store_by_identifier = AsyncMock(return_value=None)

        with pytest.raises(AuthenticationError):
            await auth_service.authenticate_admin("bad_store", "admin", "pass")

    @pytest.mark.asyncio
    async def test_invalid_username(self, auth_service, mock_repo):
        """Non-existent admin should raise AuthenticationError."""
        mock_store = MagicMock(id=1)
        mock_repo.get_store_by_identifier = AsyncMock(return_value=mock_store)
        mock_repo.get_admin_by_credentials = AsyncMock(return_value=None)

        with pytest.raises(AuthenticationError):
            await auth_service.authenticate_admin("store001", "bad_user", "pass")

    @pytest.mark.asyncio
    async def test_wrong_password(self, auth_service, mock_repo):
        """Wrong password should raise AuthenticationError."""
        mock_store = MagicMock(id=1)
        mock_admin = MagicMock(id=1, password_hash=hash_password("correct"))
        mock_repo.get_store_by_identifier = AsyncMock(return_value=mock_store)
        mock_repo.get_admin_by_credentials = AsyncMock(return_value=mock_admin)

        with pytest.raises(AuthenticationError):
            await auth_service.authenticate_admin("store001", "admin", "wrong")

    @pytest.mark.asyncio
    async def test_rate_limited(self, auth_service, mock_repo):
        """Locked out identifier should raise RateLimitError."""
        mock_repo.count_failed_attempts = AsyncMock(return_value=5)

        with pytest.raises(RateLimitError):
            await auth_service.authenticate_admin("store001", "admin", "pass")


class TestAuthenticateTable:
    """Tests for table authentication."""

    @pytest.mark.asyncio
    async def test_successful_login(self, auth_service, mock_repo):
        """Successful table login should return token."""
        mock_store = MagicMock(id=1, store_identifier="store001")
        mock_table = MagicMock(id=5, table_number=3, password_hash=hash_password("tpass"))
        mock_repo.get_store_by_identifier = AsyncMock(return_value=mock_store)
        mock_repo.get_table_by_credentials = AsyncMock(return_value=mock_table)

        result = await auth_service.authenticate_table("store001", 3, "tpass")

        assert "access_token" in result
        assert result["token_type"] == "bearer"

    @pytest.mark.asyncio
    async def test_invalid_table_number(self, auth_service, mock_repo):
        """Non-existent table should raise AuthenticationError."""
        mock_store = MagicMock(id=1)
        mock_repo.get_store_by_identifier = AsyncMock(return_value=mock_store)
        mock_repo.get_table_by_credentials = AsyncMock(return_value=None)

        with pytest.raises(AuthenticationError):
            await auth_service.authenticate_table("store001", 99, "pass")
