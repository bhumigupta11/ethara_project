from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import Customer, InventoryLog, Order, OrderItem, Product, User
from app.utils.security import create_password_hash


async def seed_demo_data(session: AsyncSession) -> None:
    existing_users = await session.scalar(select(func.count(User.id)))
    if existing_users:
        return

    demo_users = [
        User(name="Inventory Manager", email="manager@ethara.io", hashed_password=create_password_hash("Manager123!"), role="manager"),
        User(name="Read Only Viewer", email="viewer@ethara.io", hashed_password=create_password_hash("Viewer123!"), role="viewer"),
    ]
    session.add_all(demo_users)

    demo_products = [
        Product(sku="STK-001", name="Aero Wireless Mouse", description="Ergonomic wireless mouse with fast tracking.", category="Accessories", price=29.99, stock_quantity=48),
        Product(sku="STK-002", name="Vertex Backpack", description="Durable backpack built for warehouse staff.", category="Accessories", price=64.0, stock_quantity=24),
        Product(sku="STK-003", name="Neon Desk Lamp", description="Adjustable desk lighting for every workspace.", category="Office", price=39.5, stock_quantity=12),
        Product(sku="STK-004", name="Pulse Charger", description="Fast charging hub for devices and accessories.", category="Electronics", price=19.0, stock_quantity=6),
        Product(sku="STK-005", name="Eco Notebook", description="Recycled paper notebook with premium binding.", category="Stationery", price=9.99, stock_quantity=120),
    ]
    session.add_all(demo_products)

    demo_customers = [
        Customer(name="Harper Lee", email="harper.lee@example.com", phone="+1 (555) 124-0987", address="2212 Market Street, San Francisco, CA"),
        Customer(name="Avery Chen", email="avery.chen@example.com", phone="+1 (555) 221-0098", address="73 Harbor Drive, Seattle, WA"),
        Customer(name="Noah Patel", email="noah.patel@example.com", phone="+1 (555) 331-6642", address="914 Park Avenue, New York, NY"),
        Customer(name="Mia Rodriguez", email="mia.rodriguez@example.com", phone="+1 (555) 889-3321", address="1469 Elm Street, Austin, TX"),
    ]
    session.add_all(demo_customers)

    await session.commit()

    demo_products = (await session.execute(select(Product))).scalars().all()
    demo_customers = (await session.execute(select(Customer))).scalars().all()
    product_map = {product.sku: product for product in demo_products}
    customer_map = {customer.email: customer for customer in demo_customers}

    orders = [
        {
            "customer": customer_map["avery.chen@example.com"],
            "items": [
                {"sku": "STK-001", "quantity": 4},
                {"sku": "STK-002", "quantity": 2},
            ],
            "status": "completed",
        },
        {
            "customer": customer_map["noah.patel@example.com"],
            "items": [
                {"sku": "STK-003", "quantity": 3},
                {"sku": "STK-004", "quantity": 2},
            ],
            "status": "completed",
        },
        {
            "customer": customer_map["mia.rodriguez@example.com"],
            "items": [
                {"sku": "STK-005", "quantity": 10},
                {"sku": "STK-002", "quantity": 1},
            ],
            "status": "completed",
        },
    ]

    for order_data in orders:
        order = Order(customer_id=order_data["customer"].id, total_amount=0.0, status=order_data["status"], created_at=datetime.utcnow())
        session.add(order)
        await session.flush()

        total = 0.0
        for item_data in order_data["items"]:
            product = product_map[item_data["sku"]]
            quantity = item_data["quantity"]
            total += product.price * quantity
            product.stock_quantity -= quantity
            session.add(product)
            session.add(
                OrderItem(order_id=order.id, product_id=product.id, quantity=quantity, unit_price=product.price)
            )
            session.add(
                InventoryLog(product_id=product.id, quantity_change=-quantity, note="Demo order placement")
            )

        order.total_amount = total
        session.add(order)

    await session.commit()
