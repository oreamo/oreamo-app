"""create_role_table

Revision ID: v1_001_001
Revises:
Create Date: 2026-10-18

"""

import sqlalchemy as sa

from alembic import op

revision = "v1_001_001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "TB_ROLE",
        sa.Column("ROLE_CODE", sa.String(50), nullable=False, unique=True),
        sa.Column("ROLE_NAME", sa.String(100), nullable=False),
        sa.Column("SORT_ORDER", sa.Integer, nullable=False),
        sa.Column(
            "DATA_STATUS", sa.String(10), nullable=False, server_default="ENABLED"
        ),
        sa.Column("CREATED_BY", sa.String(50), nullable=False, server_default="oreamo-system"),
        sa.Column(
            "CREATED_AT",
            sa.TIMESTAMP,
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.Column("UPDATED_BY", sa.String(50), nullable=False, server_default="oreamo-system"),
        sa.Column(
            "UPDATED_AT",
            sa.TIMESTAMP,
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
        ),
        sa.PrimaryKeyConstraint("ROLE_CODE", name="TB_ROLE_PK"),
    )


def downgrade() -> None:
    op.drop_table("TB_ROLE")
