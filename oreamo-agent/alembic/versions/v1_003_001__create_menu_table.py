"""create_menu_table

Revision ID: v1_003_001
Revises: v1_002_004
Create Date: 2026-10-18

"""

import sqlalchemy as sa

from alembic import op

revision = "v1_003_001"
down_revision = "v1_002_004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "TB_MENU",
        sa.Column("MENU_ID", sa.String(50), nullable=False, unique=True),
        sa.Column("MENU_NAME", sa.String(100), nullable=False),
        sa.Column("MENU_TYPE", sa.String(50), nullable=False),
        sa.Column("URL", sa.String(50), nullable=False),
        sa.Column("PARENT_MENU_ID", sa.String(50), nullable=True),
        sa.Column("MENU_PERMISSION_CODE", sa.String(50), nullable=True),
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
        sa.PrimaryKeyConstraint("MENU_ID", name="TB_MENU_PK"),
        sa.ForeignKeyConstraint(
            ["PARENT_MENU_ID"],
            ["TB_MENU.MENU_ID"],
            name="TB_PARENT_MENU_ID_FK",
            onupdate="CASCADE",
            ondelete="RESTRICT",
        ),
        sa.ForeignKeyConstraint(
            ["MENU_PERMISSION_CODE"],
            ["TB_PERMISSION.PERMISSION_CODE"],
            name="TB_MENU_MENU_PERMISSION_CODE_FK",
            onupdate="CASCADE",
            ondelete="SET NULL",
        ),
    )


def downgrade() -> None:
    op.drop_table("TB_MENU")
