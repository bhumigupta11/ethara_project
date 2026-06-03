from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.models import Customer, InventoryLog, Order, OrderItem, Product
from app.schemas.order import OrderCreate


async def get_orders(session: AsyncSession, skip: int = 0, limit: int = 20, search: str | None = None):
    query = select(Order).options(selectinload(Order.items))
    if search:
        query = query.join(Customer).where(Customer.name.ilike(f"%{search}%") | Order.status.ilike(f"%{search}%"))
    query = query.order_by(Order.created_at.desc()).offset(skip).limit(limit)
    result = await session.execute(query)
    return result.scalars().all()


async def get_order(session: AsyncSession, order_id: int) -> Order | None:
    result = await session.execute(select(Order).options(selectinload(Order.items)).where(Order.id == order_id))
    return result.scalars().first()


async def create_order(session: AsyncSession, payload: OrderCreate) -> Order:
    customer = await session.get(Customer, payload.customer_id)
    if not customer:
        raise ValueError("Customer not found")

    requested_quantities: dict[int, int] = {}
    for item in payload.items:
        requested_quantities[item.product_id] = requested_quantities.get(item.product_id, 0) + item.quantity

    product_ids = list(requested_quantities.keys())
    products = (await session.execute(select(Product).where(Product.id.in_(product_ids)))).scalars().all()
    products_map = {product.id: product for product in products}
    if len(products_map) != len(product_ids):
        raise ValueError("One or more products do not exist")

    total_amount = 0.0
    for product_id, quantity in requested_quantities.items():
        product = products_map[product_id]
        if quantity > product.stock_quantity:
            raise ValueError(f"Insufficient stock for {product.name}")
        total_amount += quantity * product.price

    order = Order(customer_id=payload.customer_id, total_amount=total_amount, status=payload.status or "pending")
    session.add(order)
    await session.flush()
    for product_id, quantity in requested_quantities.items():
        product = products_map[product_id]
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=quantity,
            unit_price=product.price,
        )
        session.add(order_item)
        product.stock_quantity -= quantity
        session.add(product)
        log = InventoryLog(product_id=product.id, quantity_change=-quantity, note="Order placement")
        session.add(log)
    await session.commit()
    created_order = await get_order(session=session, order_id=order.id)
    if created_order is None:
        raise ValueError("Order could not be loaded after creation")
    return created_order
