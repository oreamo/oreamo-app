"""create_file_table

Revision ID: v1_005_001
Revises: v1_004_002
Create Date: 2026-10-18

"""

import sqlalchemy as sa

from alembic import op

revision = "v1_005_001"
down_revision = "v1_004_002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "FILE",
        sa.Column("FILE_ID", sa.String(36), nullable=False),
        sa.Column("FILE_GROUP_ID", sa.String(36), nullable=False),
        sa.Column("FILE_NAME", sa.String(255), nullable=False),
        sa.Column("FILE_EXTENSION", sa.String(20), nullable=False, server_default=""),
        sa.Column("FILE_CONTENT_TYPE", sa.String(100), nullable=False),
        sa.Column("FILE_SIZE", sa.BigInteger, nullable=False),
        sa.Column("FILE_PATH", sa.String(500), nullable=False),
        sa.Column(
            "DATA_STATUS", sa.String(10), nullable=False, server_default="ENABLED"
        ),
        sa.Column("CREATED_BY", sa.String(50), nullable=False, server_default="system"),
        sa.Column(
            "CREATED_AT",
            sa.TIMESTAMP,
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.Column("UPDATED_BY", sa.String(50), nullable=False, server_default="system"),
        sa.Column(
            "UPDATED_AT",
            sa.TIMESTAMP,
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
        ),
        sa.PrimaryKeyConstraint("FILE_ID", name="TB_FILE_PK"),
    )
    op.create_index("TB_FILE_IDX_01", "FILE", ["FILE_GROUP_ID"])


def downgrade() -> None:
    op.drop_table("FILE")
