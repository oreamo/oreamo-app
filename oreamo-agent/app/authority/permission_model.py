from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.common.model import DataRecordMixin
from app.core.database import Base


class PermissionEntity(DataRecordMixin, Base):
    __tablename__ = "TB_PERMISSION"

    permission_code: Mapped[str] = mapped_column(
        "PERMISSION_CODE", String(50), primary_key=True
    )
    permission_name: Mapped[str] = mapped_column("PERMISSION_NAME", String(100))
    sort_order: Mapped[int] = mapped_column("SORT_ORDER", Integer)
