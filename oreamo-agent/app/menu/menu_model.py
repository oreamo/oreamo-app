from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.common.model import DataRecordMixin
from app.core.database import Base


class MenuEntity(DataRecordMixin, Base):
    __tablename__ = "TB_MENU"

    menu_id: Mapped[str] = mapped_column("MENU_ID", String(50), primary_key=True)
    menu_name: Mapped[str] = mapped_column("MENU_NAME", String(100))
    menu_type: Mapped[str] = mapped_column("MENU_TYPE", String(50))
    url: Mapped[str] = mapped_column("URL", String(50))
    parent_menu_id: Mapped[str | None] = mapped_column(
        "PARENT_MENU_ID",
        String(50),
        ForeignKey("TB_MENU.MENU_ID", ondelete="RESTRICT", onupdate="CASCADE"),
    )
    menu_permission_code: Mapped[str | None] = mapped_column(
        "MENU_PERMISSION_CODE",
        String(50),
        ForeignKey(
            "TB_PERMISSION.PERMISSION_CODE", ondelete="SET NULL", onupdate="CASCADE"
        ),
    )
    sort_order: Mapped[int] = mapped_column("SORT_ORDER", Integer)
