from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.database.database import get_session
from app.schemas.dashboard import DashboardRead
from app.services.dashboard_service import get_dashboard_data

router = APIRouter()


@router.get("/stats", response_model=DashboardRead)
async def dashboard_stats(session: AsyncSession = Depends(get_session), user=Depends(get_current_user)):
    return await get_dashboard_data(session=session)
