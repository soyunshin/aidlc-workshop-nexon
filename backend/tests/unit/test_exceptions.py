"""Unit tests for custom exceptions."""

import pytest

from app.core.exceptions import (
    AppException,
    AuthenticationError,
    AuthorizationError,
    ConflictError,
    NotFoundError,
    RateLimitError,
    ValidationError,
)


class TestExceptionHierarchy:
    """Tests for exception class hierarchy and defaults."""

    def test_app_exception_defaults(self):
        """AppException should have default values."""
        exc = AppException()
        assert exc.message == "An error occurred"
        assert exc.code == "APP_ERROR"
        assert exc.status_code == 500

    def test_authentication_error(self):
        """AuthenticationError should be 401."""
        exc = AuthenticationError()
        assert exc.status_code == 401
        assert exc.code == "AUTHENTICATION_ERROR"
        assert isinstance(exc, AppException)

    def test_authorization_error(self):
        """AuthorizationError should be 403."""
        exc = AuthorizationError()
        assert exc.status_code == 403
        assert exc.code == "AUTHORIZATION_ERROR"
        assert isinstance(exc, AppException)

    def test_not_found_error(self):
        """NotFoundError should be 404."""
        exc = NotFoundError()
        assert exc.status_code == 404
        assert exc.code == "NOT_FOUND"

    def test_validation_error(self):
        """ValidationError should be 422."""
        exc = ValidationError()
        assert exc.status_code == 422
        assert exc.code == "VALIDATION_ERROR"

    def test_conflict_error(self):
        """ConflictError should be 409."""
        exc = ConflictError()
        assert exc.status_code == 409
        assert exc.code == "CONFLICT_ERROR"

    def test_rate_limit_error(self):
        """RateLimitError should be 429 with retry_after."""
        exc = RateLimitError()
        assert exc.status_code == 429
        assert exc.code == "RATE_LIMIT_ERROR"
        assert exc.retry_after == 900

    def test_rate_limit_error_custom_retry(self):
        """RateLimitError should accept custom retry_after."""
        exc = RateLimitError(retry_after=300)
        assert exc.retry_after == 300

    def test_custom_message(self):
        """Exceptions should accept custom messages."""
        exc = AuthenticationError("Token expired")
        assert exc.message == "Token expired"

    def test_all_exceptions_inherit_from_app_exception(self):
        """All custom exceptions should inherit from AppException."""
        exceptions = [
            AuthenticationError(),
            AuthorizationError(),
            NotFoundError(),
            ValidationError(),
            ConflictError(),
            RateLimitError(),
        ]
        for exc in exceptions:
            assert isinstance(exc, AppException)
            assert isinstance(exc, Exception)
