from sqlalchemy import BigInteger, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.common.model import DataRecordMixin
from app.core.database import Base


class CommonCodeEntity(DataRecordMixin, Base):
    __tablename__ = "TB_COMMON_CODE"

    group_code: Mapped[str] = mapped_column(
        "GROUP_CODE",
        String(50),
        ForeignKey("TB_GROUP_CODE.GROUP_CODE", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    )
    common_code: Mapped[str] = mapped_column(
        "COMMON_CODE", String(50), primary_key=True
    )
    common_code_name: Mapped[str] = mapped_column("COMMON_CODE_NAME", String(100))
    common_code_description: Mapped[str | None] = mapped_column(
        "COMMON_CODE_DESC", String(255)
    )
    sort_order: Mapped[int] = mapped_column("SORT_ORDER", BigInteger)
