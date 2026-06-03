from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.database import get_session
from app.schemas.auth import Token, UserCreate, UserLogin, UserRead
from app.services.auth_service import authenticate_user, create_tokens, create_user

router = APIRouter()


@router.post("/register", response_model=UserRead)
async def register(payload: UserCreate, session: AsyncSession = Depends(get_session)):
    user = await create_user(session=session, payload=payload)
    return user


@router.post("/login", response_model=Token)
async def login(payload: UserLogin, session: AsyncSession = Depends(get_session)):
    user = await authenticate_user(session=session, email=payload.email, password=payload.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect credentials")
    return create_tokens(user)
