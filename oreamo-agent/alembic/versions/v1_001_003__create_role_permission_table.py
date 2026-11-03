"""create_role_permission_table

Revision ID: v1_001_003
Revises: v1_001_002
Create Date: 2026-10-18

"""

import sqlalchemy as sa

from alembic import op

revision = "v1_001_003"
down_revision = "v1_001_002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "TB_ROLE_PERMISSION",
        sa.Column("ROLE_CODE", sa.String(50), nullable=False),
        sa.Column("PERMISSION_CODE", sa.String(50), nullable=False),
        sa.PrimaryKeyConstraint(
            "ROLE_CODE", "PERMISSION_CODE", name="TB_ROLE_PERMISSION_PK"
        ),
        sa.ForeignKeyConstraint(
            ["ROLE_CODE"],
            ["TB_ROLE.ROLE_CODE"],
            name="TB_ROLE_PERMISSION_ROLE_CODE_FK",
            onupdate="CASCADE",
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["PERMISSION_CODE"],
            ["TB_PERMISSION.PERMISSION_CODE"],
            name="TB_ROLE_PERMISSION_PERMISSION_CODE_FK",
            onupdate="CASCADE",
            ondelete="CASCADE",
        ),
    )


def downgrade() -> None:
    op.drop_table("TB_ROLE_PERMISSION")
