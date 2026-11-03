from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.common.model import DataRecordMixin
from app.core.database import Base


class RoleEntity(DataRecordMixin, Base):
    __tablename__ = "TB_ROLE"

    role_code: Mapped[str] = mapped_column("ROLE_CODE", String(50), primary_key=True)
    role_name: Mapped[str] = mapped_column("ROLE_NAME", String(100))
    sort_order: Mapped[int] = mapped_column("SORT_ORDER", Integer)


class RolePermissionEntity(Base):
    __tablename__ = "TB_ROLE_PERMISSION"

    role_code: Mapped[str] = mapped_column(
        "ROLE_CODE",
        String(50),
        ForeignKey("TB_ROLE.ROLE_CODE", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    )
    permission_code: Mapped[str] = mapped_column(
        "PERMISSION_CODE",
        String(50),
        ForeignKey(
            "TB_PERMISSION.PERMISSION_CODE", ondelete="CASCADE", onupdate="CASCADE"
        ),
        primary_key=True,
    )
