from datetime import datetime
from typing import List

from pydantic import BaseModel, ConfigDict


class DashboardMetric(BaseModel):
    total_products: int
    total_customers: int
    total_orders: int
    total_revenue: float
    low_stock_products: int


class RevenueTrendItem(BaseModel):
    month: str
    revenue: float
    orders: int


class DashboardRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    metrics: DashboardMetric
    recent_orders: List[dict]
    revenue_trends: List[RevenueTrendItem]
    inventory_status: List[dict]
