from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.common.model import DataRecordMixin
from app.core.database import Base


class UserEntity(DataRecordMixin, Base):
    __tablename__ = "TB_USER"

    username: Mapped[str] = mapped_column("USERNAME", String(50), primary_key=True)
    password: Mapped[str] = mapped_column("PASSWORD", String(255))
    role_code: Mapped[str] = mapped_column(
        "ROLE_CODE",
        String(50),
        ForeignKey("TB_ROLE.ROLE_CODE", ondelete="RESTRICT", onupdate="CASCADE"),
    )
    profile_image_file_group_id: Mapped[str | None] = mapped_column(
        "PROFILE_IMAGE_FILE_GROUP_ID", String(36)
    )
