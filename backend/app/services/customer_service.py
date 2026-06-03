from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate


async def get_customers(
    session: AsyncSession,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
) -> list[Customer]:
    query = select(Customer)
    if search:
        query = query.where(Customer.name.ilike(f"%{search}%") | Customer.email.ilike(f"%{search}%"))
    query = query.offset(skip).limit(limit)
    result = await session.execute(query)
    return result.scalars().all()


async def get_customer(session: AsyncSession, customer_id: int) -> Customer | None:
    result = await session.execute(select(Customer).where(Customer.id == customer_id))
    return result.scalars().first()


async def create_customer(session: AsyncSession, payload: CustomerCreate) -> Customer:
    existing = await session.execute(select(Customer).where(Customer.email == payload.email))
    if existing.scalars().first():
        raise ValueError("Customer email already exists")
    customer = Customer(**payload.model_dump())
    session.add(customer)
    await session.commit()
    await session.refresh(customer)
    return customer


async def update_customer(session: AsyncSession, customer: Customer, payload: CustomerUpdate) -> Customer:
    if payload.email and payload.email != customer.email:
        existing = await session.execute(select(Customer).where(Customer.email == payload.email))
        if existing.scalars().first():
            raise ValueError("Customer email already exists")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(customer, field, value)
    session.add(customer)
    await session.commit()
    await session.refresh(customer)
    return customer


async def delete_customer(session: AsyncSession, customer: Customer) -> None:
    await session.delete(customer)
    await session.commit()
