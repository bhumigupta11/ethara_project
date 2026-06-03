from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.database.database import get_session
from app.schemas.customer import CustomerCreate, CustomerRead, CustomerUpdate
from app.services.customer_service import create_customer, delete_customer, get_customer, get_customers, update_customer

router = APIRouter()


@router.get("/", response_model=list[CustomerRead])
async def list_customers(
    search: Optional[str] = Query(None, description="Search customers by name or email"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
    user=Depends(get_current_user),
):
    return await get_customers(session=session, search=search, skip=skip, limit=limit)


@router.post("/", response_model=CustomerRead, status_code=status.HTTP_201_CREATED)
async def create_new_customer(payload: CustomerCreate, session: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    return await create_customer(session=session, payload=payload)


@router.put("/{customer_id}", response_model=CustomerRead)
async def update_existing_customer(customer_id: int, payload: CustomerUpdate, session: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    customer = await get_customer(session=session, customer_id=customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return await update_customer(session=session, customer=customer, payload=payload)


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_customer(customer_id: int, session: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    customer = await get_customer(session=session, customer_id=customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    await delete_customer(session=session, customer=customer)
    return None
