"""create_user_table

Revision ID: v1_001_004
Revises: v1_001_003
Create Date: 2026-10-18

"""

import sqlalchemy as sa

from alembic import op

revision = "v1_001_004"
down_revision = "v1_001_003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "TB_USER",
        sa.Column("USERNAME", sa.String(50), nullable=False, unique=True),
        sa.Column("PASSWORD", sa.String(255), nullable=False),
        sa.Column("ROLE_CODE", sa.String(50), nullable=False),
        sa.Column("PROFILE_IMAGE_FILE_GROUP_ID", sa.String(36), nullable=True),
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
        sa.PrimaryKeyConstraint("USERNAME", name="TB_USER_PK"),
        sa.ForeignKeyConstraint(
            ["ROLE_CODE"],
            ["TB_ROLE.ROLE_CODE"],
            name="TB_USER_ROLE_CODE_FK",
            onupdate="CASCADE",
            ondelete="RESTRICT",
        ),
    )


def downgrade() -> None:
    op.drop_table("TB_USER")
