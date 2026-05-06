"""Unit tests for auth schemas validation."""

import pytest
from pydantic import ValidationError

from app.auth.schemas import AdminLoginRequest, TableLoginRequest, TokenResponse


class TestAdminLoginRequest:
    """Tests for AdminLoginRequest validation."""

    def test_valid_request(self):
        """Valid admin login request should pass."""
        req = AdminLoginRequest(
            store_identifier="store001",
            username="admin",
            password="password123",
        )
        assert req.store_identifier == "store001"
        assert req.username == "admin"
        assert req.password == "password123"

    def test_empty_store_identifier(self):
        """Empty store_identifier should fail."""
        with pytest.raises(ValidationError):
            AdminLoginRequest(
                store_identifier="",
                username="admin",
                password="password123",
            )

    def test_empty_username(self):
        """Empty username should fail."""
        with pytest.raises(ValidationError):
            AdminLoginRequest(
                store_identifier="store001",
                username="",
                password="password123",
            )

    def test_empty_password(self):
        """Empty password should fail."""
        with pytest.raises(ValidationError):
            AdminLoginRequest(
                store_identifier="store001",
                username="admin",
                password="",
            )

    def test_password_max_length(self):
        """Password exceeding 128 chars should fail."""
        with pytest.raises(ValidationError):
            AdminLoginRequest(
                store_identifier="store001",
                username="admin",
                password="x" * 129,
            )


class TestTableLoginRequest:
    """Tests for TableLoginRequest validation."""

    def test_valid_request(self):
        """Valid table login request should pass."""
        req = TableLoginRequest(
            store_identifier="store001",
            table_number=5,
            password="table_pass",
        )
        assert req.table_number == 5

    def test_table_number_zero(self):
        """Table number 0 should fail (must be > 0)."""
        with pytest.raises(ValidationError):
            TableLoginRequest(
                store_identifier="store001",
                table_number=0,
                password="pass",
            )

    def test_table_number_negative(self):
        """Negative table number should fail."""
        with pytest.raises(ValidationError):
            TableLoginRequest(
                store_identifier="store001",
                table_number=-1,
                password="pass",
            )


class TestTokenResponse:
    """Tests for TokenResponse."""

    def test_token_response(self):
        """TokenResponse should have default token_type."""
        resp = TokenResponse(access_token="abc.def.ghi")
        assert resp.access_token == "abc.def.ghi"
        assert resp.token_type == "bearer"
