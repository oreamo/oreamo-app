"""create_permission_table

Revision ID: v1_001_002
Revises: v1_001_001
Create Date: 2026-10-18

"""

import sqlalchemy as sa

from alembic import op

revision = "v1_001_002"
down_revision = "v1_001_001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "TB_PERMISSION",
        sa.Column("PERMISSION_CODE", sa.String(50), nullable=False, unique=True),
        sa.Column("PERMISSION_NAME", sa.String(100), nullable=False),
        sa.Column("SORT_ORDER", sa.Integer, nullable=False),
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
        sa.PrimaryKeyConstraint("PERMISSION_CODE", name="TB_PERMISSION_PK"),
    )


def downgrade() -> None:
    op.drop_table("TB_PERMISSION")
