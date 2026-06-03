from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import Product
from app.schemas.product import ProductCreate, ProductUpdate


async def get_products(
    session: AsyncSession,
    search: Optional[str] = None,
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
) -> list[Product]:
    query = select(Product)
    if search:
        query = query.where(Product.name.ilike(f"%{search}%") | Product.sku.ilike(f"%{search}%"))
    if category:
        query = query.where(Product.category == category)
    query = query.offset(skip).limit(limit)
    result = await session.execute(query)
    return result.scalars().all()


async def get_product(session: AsyncSession, product_id: int) -> Product | None:
    result = await session.execute(select(Product).where(Product.id == product_id))
    return result.scalars().first()


async def create_product(session: AsyncSession, payload: ProductCreate) -> Product:
    existing = await session.execute(select(Product).where(Product.sku == payload.sku))
    if existing.scalars().first():
        raise ValueError("Product SKU already exists")
    product = Product(**payload.model_dump())
    session.add(product)
    await session.commit()
    await session.refresh(product)
    return product


async def update_product(session: AsyncSession, product: Product, payload: ProductUpdate) -> Product:
    if payload.sku and payload.sku != product.sku:
        existing = await session.execute(select(Product).where(Product.sku == payload.sku))
        if existing.scalars().first():
            raise ValueError("Product SKU already exists")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    session.add(product)
    await session.commit()
    await session.refresh(product)
    return product


async def delete_product(session: AsyncSession, product: Product) -> None:
    await session.delete(product)
    await session.commit()


async def count_low_stock(session: AsyncSession, threshold: int = 10) -> int:
    result = await session.execute(select(func.count(Product.id)).where(Product.stock_quantity <= threshold))
    return result.scalar_one()


async def get_inventory_status(session: AsyncSession, threshold: int = 10) -> list[Product]:
    result = await session.execute(select(Product).order_by(Product.stock_quantity.asc()))
    return result.scalars().all()
