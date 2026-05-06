"""Table module Pydantic schemas."""

from datetime import datetime

from pydantic import BaseModel, Field


class TableSetup(BaseModel):
    """Request to set up a new table."""

    table_number: int = Field(gt=0)
    password: str = Field(min_length=1, max_length=128)


class TableResponse(BaseModel):
    """Table response."""

    id: int
    table_number: int
    has_active_session: bool = False
    total_amount: int = 0

    model_config = {"from_attributes": True}


class TableHistoryResponse(BaseModel):
    """Order history for a table."""

    order_number: str
    total_amount: int
    ordered_at: datetime
    status: str
    items_count: int
