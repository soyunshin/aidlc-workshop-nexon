"""Unit tests for security utilities."""

from datetime import timedelta
from unittest.mock import patch

import jwt
import pytest

from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)


class TestPasswordHashing:
    """Tests for password hashing and verification."""

    def test_hash_password_returns_string(self):
        """hash_password should return a non-empty string."""
        result = hash_password("test_password")
        assert isinstance(result, str)
        assert len(result) > 0

    def test_hash_password_different_from_plain(self):
        """Hashed password should differ from plain text."""
        plain = "my_secret_password"
        hashed = hash_password(plain)
        assert hashed != plain

    def test_hash_password_unique_per_call(self):
        """Each hash should be unique due to random salt."""
        plain = "same_password"
        hash1 = hash_password(plain)
        hash2 = hash_password(plain)
        assert hash1 != hash2

    def test_verify_password_correct(self):
        """verify_password should return True for correct password."""
        plain = "correct_password"
        hashed = hash_password(plain)
        assert verify_password(plain, hashed) is True

    def test_verify_password_incorrect(self):
        """verify_password should return False for wrong password."""
        hashed = hash_password("correct_password")
        assert verify_password("wrong_password", hashed) is False

    def test_verify_password_empty_string(self):
        """verify_password should handle empty string correctly."""
        hashed = hash_password("")
        assert verify_password("", hashed) is True
        assert verify_password("not_empty", hashed) is False


class TestJWT:
    """Tests for JWT token creation and decoding."""

    @patch("app.core.security.get_settings")
    def test_create_access_token(self, mock_settings):
        """create_access_token should return a valid JWT string."""
        mock_settings.return_value.secret_key = "test-secret-key-32-chars-minimum!"
        mock_settings.return_value.jwt_algorithm = "HS256"
        mock_settings.return_value.jwt_expire_hours = 16

        token = create_access_token({"sub": "admin_1", "store_id": 1, "role": "admin"})
        assert isinstance(token, str)
        assert len(token) > 0

    @patch("app.core.security.get_settings")
    def test_decode_access_token_valid(self, mock_settings):
        """decode_access_token should return payload for valid token."""
        mock_settings.return_value.secret_key = "test-secret-key-32-chars-minimum!"
        mock_settings.return_value.jwt_algorithm = "HS256"
        mock_settings.return_value.jwt_expire_hours = 16

        data = {"sub": "admin_1", "store_id": 1, "role": "admin"}
        token = create_access_token(data)
        payload = decode_access_token(token)

        assert payload["sub"] == "admin_1"
        assert payload["store_id"] == 1
        assert payload["role"] == "admin"
        assert "exp" in payload
        assert "iat" in payload

    @patch("app.core.security.get_settings")
    def test_decode_access_token_expired(self, mock_settings):
        """decode_access_token should raise for expired token."""
        mock_settings.return_value.secret_key = "test-secret-key-32-chars-minimum!"
        mock_settings.return_value.jwt_algorithm = "HS256"
        mock_settings.return_value.jwt_expire_hours = 16

        token = create_access_token(
            {"sub": "admin_1"}, expires_delta=timedelta(seconds=-1)
        )
        with pytest.raises(jwt.ExpiredSignatureError):
            decode_access_token(token)

    @patch("app.core.security.get_settings")
    def test_decode_access_token_invalid(self, mock_settings):
        """decode_access_token should raise for tampered token."""
        mock_settings.return_value.secret_key = "test-secret-key-32-chars-minimum!"
        mock_settings.return_value.jwt_algorithm = "HS256"

        with pytest.raises(jwt.InvalidTokenError):
            decode_access_token("invalid.token.here")

    @patch("app.core.security.get_settings")
    def test_create_token_custom_expiry(self, mock_settings):
        """create_access_token should respect custom expires_delta."""
        mock_settings.return_value.secret_key = "test-secret-key-32-chars-minimum!"
        mock_settings.return_value.jwt_algorithm = "HS256"
        mock_settings.return_value.jwt_expire_hours = 16

        token = create_access_token(
            {"sub": "table_5"}, expires_delta=timedelta(hours=1)
        )
        payload = decode_access_token(token)
        assert payload["sub"] == "table_5"
