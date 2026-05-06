"""Unit tests for OrderService business logic."""

from unittest.mock import AsyncMock, MagicMock

import pytest

from app.core.exceptions import NotFoundError, ValidationError
from app.models.order import OrderStatus
from app.order.schemas import OrderCreate, OrderItemCreate, OrderStatusUpdate
from app.order.service import OrderService


@pytest.fixture
def mock_order_repo():
    return AsyncMock()


@pytest.fixture
def mock_menu_repo():
    return AsyncMock()


@pytest.fixture
def order_service(mock_order_repo, mock_menu_repo):
    return OrderService(mock_order_repo, mock_menu_repo)


class TestCreateOrder:
    """Tests for order creation."""

    @pytest.mark.asyncio
    async def test_create_order_success(self, order_service, mock_order_repo, mock_menu_repo):
        """Should create order with valid menu items."""
        mock_item = MagicMock()
        mock_item.id = 1
        mock_item.store_id = 1
        mock_item.price = 5000
        mock_item.is_available = True
        mock_item.name = "커피"
        mock_menu_repo.get_menu_item_by_id = AsyncMock(return_value=mock_item)
        mock_order_repo.get_next_order_number = AsyncMock(return_value="20260506-0001")
        mock_order_repo.create_order = AsyncMock(return_value=MagicMock(
            id=1, order_number="20260506-0001", total_amount=10000
        ))

        data = OrderCreate(items=[OrderItemCreate(menu_item_id=1, quantity=2)])
        result = await order_service.create_order(
            store_id=1, table_id=1, session_id=1, data=data
        )
        assert result.total_amount == 10000

    @pytest.mark.asyncio
    async def test_create_order_invalid_menu_item(self, order_service, mock_menu_repo):
        """Should raise ValidationError for non-existent menu item."""
        mock_menu_repo.get_menu_item_by_id = AsyncMock(return_value=None)

        data = OrderCreate(items=[OrderItemCreate(menu_item_id=99, quantity=1)])
        with pytest.raises(ValidationError):
            await order_service.create_order(store_id=1, table_id=1, session_id=1, data=data)

    @pytest.mark.asyncio
    async def test_create_order_unavailable_item(self, order_service, mock_menu_repo):
        """Should raise ValidationError for unavailable menu item."""
        mock_item = MagicMock()
        mock_item.id = 1
        mock_item.store_id = 1
        mock_item.is_available = False
        mock_item.name = "품절메뉴"
        mock_menu_repo.get_menu_item_by_id = AsyncMock(return_value=mock_item)

        data = OrderCreate(items=[OrderItemCreate(menu_item_id=1, quantity=1)])
        with pytest.raises(ValidationError, match="not available"):
            await order_service.create_order(store_id=1, table_id=1, session_id=1, data=data)


class TestUpdateOrderStatus:
    """Tests for order status transitions."""

    @pytest.mark.asyncio
    async def test_valid_transition_pending_to_preparing(self, order_service, mock_order_repo):
        """Should allow pending -> preparing."""
        mock_order = MagicMock(id=1, store_id=1, status=OrderStatus.PENDING)
        mock_order_repo.get_order_by_id = AsyncMock(return_value=mock_order)
        mock_order_repo.update_order_status = AsyncMock(return_value=mock_order)

        data = OrderStatusUpdate(status=OrderStatus.PREPARING)
        await order_service.update_order_status(1, store_id=1, data=data)
        mock_order_repo.update_order_status.assert_called_once()

    @pytest.mark.asyncio
    async def test_invalid_transition_pending_to_completed(self, order_service, mock_order_repo):
        """Should reject pending -> completed (skip not allowed)."""
        mock_order = MagicMock(id=1, store_id=1, status=OrderStatus.PENDING)
        mock_order_repo.get_order_by_id = AsyncMock(return_value=mock_order)

        data = OrderStatusUpdate(status=OrderStatus.COMPLETED)
        with pytest.raises(ValidationError, match="Cannot transition"):
            await order_service.update_order_status(1, store_id=1, data=data)

    @pytest.mark.asyncio
    async def test_invalid_transition_completed_to_pending(self, order_service, mock_order_repo):
        """Should reject completed -> pending (reverse not allowed)."""
        mock_order = MagicMock(id=1, store_id=1, status=OrderStatus.COMPLETED)
        mock_order_repo.get_order_by_id = AsyncMock(return_value=mock_order)

        data = OrderStatusUpdate(status=OrderStatus.PENDING)
        with pytest.raises(ValidationError, match="Cannot transition"):
            await order_service.update_order_status(1, store_id=1, data=data)

    @pytest.mark.asyncio
    async def test_order_not_found(self, order_service, mock_order_repo):
        """Should raise NotFoundError for non-existent order."""
        mock_order_repo.get_order_by_id = AsyncMock(return_value=None)

        data = OrderStatusUpdate(status=OrderStatus.PREPARING)
        with pytest.raises(NotFoundError):
            await order_service.update_order_status(99, store_id=1, data=data)
