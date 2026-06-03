from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.database.database import get_session
from app.schemas.order import OrderCreate, OrderRead
from app.services.order_service import create_order, get_order, get_orders

router = APIRouter()


@router.get("/", response_model=list[OrderRead])
async def list_orders(
    search: Optional[str] = Query(None, description="Search by customer or status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
    user=Depends(get_current_user),
):
    return await get_orders(session=session, skip=skip, limit=limit, search=search)


@router.post("/", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
async def create_new_order(payload: OrderCreate, session: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    return await create_order(session=session, payload=payload)


@router.get("/{order_id}", response_model=OrderRead)
async def get_order_details(order_id: int, session: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    order = await get_order(session=session, order_id=order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order
