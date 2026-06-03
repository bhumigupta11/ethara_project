from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class InventoryLogRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    quantity_change: int
    note: str
    created_at: datetime


class InventoryStatus(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_id: int
    sku: str
    name: str
    stock_quantity: int
    status: str
