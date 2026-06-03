from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, validator


class ProductBase(BaseModel):
    sku: str = Field(..., min_length=3)
    name: str = Field(..., min_length=2)
    description: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    price: float = Field(..., gt=0)
    stock_quantity: int = Field(..., ge=0)

    @validator("sku")
    def format_sku(cls, value: str) -> str:
        return value.strip().upper()


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    sku: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    stock_quantity: Optional[int] = Field(None, ge=0)

    @validator("sku")
    def format_sku(cls, value: Optional[str]) -> Optional[str]:
        return value.strip().upper() if value else value


class ProductRead(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
