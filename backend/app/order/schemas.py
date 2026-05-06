"""Order module Pydantic schemas."""

from datetime import datetime

from pydantic import BaseModel, Field

from app.models.order import OrderStatus


# --- Order Creation ---


class OrderItemCreate(BaseModel):
    """Single item in an order creation request."""

    menu_item_id: int = Field(gt=0)
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    """Request to create an order."""

    items: list[OrderItemCreate] = Field(min_length=1)


# --- Order Responses ---


class OrderItemResponse(BaseModel):
    """Order item in response."""

    id: int
    menu_item_id: int | None
    item_name: str
    unit_price: int
    quantity: int
    subtotal: int

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    """Order response."""

    id: int
    order_number: str
    status: OrderStatus
    total_amount: int
    ordered_at: datetime
    items: list[OrderItemResponse] = []

    model_config = {"from_attributes": True}


# --- Status Update ---


class OrderStatusUpdate(BaseModel):
    """Request to update order status."""

    status: OrderStatus
