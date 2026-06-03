from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.database.database import get_session
from app.schemas.product import ProductCreate, ProductRead, ProductUpdate
from app.services.product_service import create_product, delete_product, get_product, get_products, update_product

router = APIRouter()


@router.get("/", response_model=list[ProductRead])
async def list_products(
    search: Optional[str] = Query(None, description="Search by name or SKU"),
    category: Optional[str] = Query(None, description="Filter by category"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
    user=Depends(get_current_user),
):
    return await get_products(session=session, search=search, category=category, skip=skip, limit=limit)


@router.post("/", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
async def create_new_product(payload: ProductCreate, session: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    return await create_product(session=session, payload=payload)


@router.put("/{product_id}", response_model=ProductRead)
async def update_existing_product(product_id: int, payload: ProductUpdate, session: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    product = await get_product(session=session, product_id=product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return await update_product(session=session, product=product, payload=payload)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_product(product_id: int, session: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    product = await get_product(session=session, product_id=product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    await delete_product(session=session, product=product)
    return None
