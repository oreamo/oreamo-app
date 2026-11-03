from sqlalchemy import BigInteger, String
from sqlalchemy.orm import Mapped, mapped_column

from app.common.model import DataRecordMixin
from app.core.database import Base


class FileEntity(DataRecordMixin, Base):
    __tablename__ = "FILE"

    file_id: Mapped[str] = mapped_column("FILE_ID", String(36), primary_key=True)
    file_group_id: Mapped[str] = mapped_column("FILE_GROUP_ID", String(36), index=True)
    file_name: Mapped[str] = mapped_column("FILE_NAME", String(255))
    file_extension: Mapped[str] = mapped_column("FILE_EXTENSION", String(20))
    file_content_type: Mapped[str] = mapped_column("FILE_CONTENT_TYPE", String(100))
    file_size: Mapped[int] = mapped_column("FILE_SIZE", BigInteger)
    file_path: Mapped[str] = mapped_column("FILE_PATH", String(500))
