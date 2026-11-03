from sqlalchemy import BigInteger, String
from sqlalchemy.orm import Mapped, mapped_column

from app.common.model import DataRecordMixin
from app.core.database import Base


class GroupCodeEntity(DataRecordMixin, Base):
    __tablename__ = "TB_GROUP_CODE"

    group_code: Mapped[str] = mapped_column("GROUP_CODE", String(50), primary_key=True)
    group_code_name: Mapped[str] = mapped_column("GROUP_CODE_NAME", String(100))
    group_code_description: Mapped[str | None] = mapped_column(
        "GROUP_CODE_DESC", String(255)
    )
    sort_order: Mapped[int] = mapped_column("SORT_ORDER", BigInteger)
