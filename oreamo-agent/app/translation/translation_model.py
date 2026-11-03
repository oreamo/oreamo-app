from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.common.model import DataRecordMixin
from app.core.database import Base


class TranslationEntity(DataRecordMixin, Base):
    __tablename__ = "TRANSLATION"

    translation_group: Mapped[str] = mapped_column(
        "TRANSLATION_GROUP", String(50), primary_key=True
    )
    translation_type: Mapped[str] = mapped_column(
        "TRANSLATION_TYPE", String(50), primary_key=True
    )
    translation_code: Mapped[str] = mapped_column(
        "TRANSLATION_CODE", String(50), primary_key=True
    )
    translation_locale: Mapped[str] = mapped_column(
        "TRANSLATION_LOCALE", String(2), primary_key=True
    )
    translation_content: Mapped[str] = mapped_column("TRANSLATION_CONTENT", String(255))
