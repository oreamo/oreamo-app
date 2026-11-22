from datetime import datetime

from sqlalchemy import TIMESTAMP, String
from sqlalchemy.orm import Mapped, mapped_column


class DataRecordMixin:
    data_status: Mapped[str] = mapped_column("DATA_STATUS", String(10))
    created_by: Mapped[str] = mapped_column("CREATED_BY", String(50))
    created_at: Mapped[datetime] = mapped_column("CREATED_AT", TIMESTAMP)
    updated_by: Mapped[str] = mapped_column("UPDATED_BY", String(50))
    updated_at: Mapped[datetime] = mapped_column("UPDATED_AT", TIMESTAMP)
