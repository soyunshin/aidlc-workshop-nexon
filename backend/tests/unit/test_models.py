"""Unit tests for SQLAlchemy models."""

import pytest

from app.models.order import VALID_STATUS_TRANSITIONS, OrderStatus


class TestOrderStatus:
    """Tests for order status transitions."""

    def test_valid_transitions_pending_to_preparing(self):
        """pending -> preparing should be valid."""
        assert OrderStatus.PREPARING in VALID_STATUS_TRANSITIONS[OrderStatus.PENDING]

    def test_valid_transitions_preparing_to_completed(self):
        """preparing -> completed should be valid."""
        assert OrderStatus.COMPLETED in VALID_STATUS_TRANSITIONS[OrderStatus.PREPARING]

    def test_invalid_transition_pending_to_completed(self):
        """pending -> completed (skip) should be invalid."""
        assert OrderStatus.COMPLETED not in VALID_STATUS_TRANSITIONS[OrderStatus.PENDING]

    def test_invalid_transition_completed_to_any(self):
        """completed -> any should be invalid (terminal state)."""
        assert VALID_STATUS_TRANSITIONS[OrderStatus.COMPLETED] == []

    def test_invalid_transition_preparing_to_pending(self):
        """preparing -> pending (reverse) should be invalid."""
        assert OrderStatus.PENDING not in VALID_STATUS_TRANSITIONS[OrderStatus.PREPARING]

    def test_all_statuses_have_transition_rules(self):
        """Every status should have a transition rule defined."""
        for status in OrderStatus:
            assert status in VALID_STATUS_TRANSITIONS

    def test_order_status_values(self):
        """OrderStatus enum values should match expected strings."""
        assert OrderStatus.PENDING.value == "pending"
        assert OrderStatus.PREPARING.value == "preparing"
        assert OrderStatus.COMPLETED.value == "completed"
