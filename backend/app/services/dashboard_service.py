from datetime import datetime
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import Customer, InventoryLog, Order, OrderItem, Product


async def get_dashboard_data(session: AsyncSession) -> dict:
    total_products = await session.scalar(select(func.count(Product.id)))
    total_customers = await session.scalar(select(func.count(Customer.id)))
    total_orders = await session.scalar(select(func.count(Order.id)))
    total_revenue = await session.scalar(select(func.coalesce(func.sum(Order.total_amount), 0.0)))
    low_stock_products = await session.scalar(select(func.count(Product.id)).where(Product.stock_quantity <= 10))

    recent_orders = (
        await session.execute(
            select(Order.id, Order.total_amount, Order.status, Order.created_at, Customer.name.label("customer_name"))
            .join(Customer)
            .order_by(Order.created_at.desc())
            .limit(6)
        )
    ).mappings().all()

    current_year = datetime.utcnow().year
    revenue_trends = (
        await session.execute(
            select(
                func.extract("month", Order.created_at).label("month"),
                func.coalesce(func.sum(Order.total_amount), 0.0).label('revenue'),
                func.count(Order.id).label('orders'),
            )
            .where(func.extract("year", Order.created_at) == current_year)
            .group_by(func.extract("month", Order.created_at))
            .order_by(func.extract("month", Order.created_at))
        )
    ).all()

    revenue_trends_formatted = []
    for row in revenue_trends:
        try:
            month_num = int(row.month)
            month_name = datetime(1900, month_num, 1).strftime('%b')
        except Exception:
            month_name = str(row.month)
        revenue_trends_formatted.append({
            'month': month_name,
            'revenue': float(row.revenue),
            'orders': int(row.orders),
        })

    inventory_status = (
        await session.execute(
            select(Product.id, Product.sku, Product.name, Product.stock_quantity)
            .order_by(Product.stock_quantity.asc())
            .limit(8)
        )
    ).mappings().all()

    inventory_status = [
        {
            "product_id": item.id,
            "sku": item.sku,
            "name": item.name,
            "stock_quantity": item.stock_quantity,
            "status": "out of stock" if item.stock_quantity == 0 else "low stock" if item.stock_quantity <= 10 else "in stock",
        }
        for item in inventory_status
    ]

    return {
        "metrics": {
            "total_products": int(total_products or 0),
            "total_customers": int(total_customers or 0),
            "total_orders": int(total_orders or 0),
            "total_revenue": float(total_revenue or 0.0),
            "low_stock_products": int(low_stock_products or 0),
        },
        "recent_orders": [
            {
                "id": row.id,
                "customer_name": row.customer_name,
                "total_amount": float(row.total_amount),
                "status": row.status,
                "created_at": row.created_at.isoformat(),
            }
            for row in recent_orders
        ],
        "revenue_trends": revenue_trends_formatted,
        "inventory_status": inventory_status,
    }
