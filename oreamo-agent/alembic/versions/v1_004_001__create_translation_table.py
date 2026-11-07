"""create_translation_table

Revision ID: v1_004_001
Revises: v1_003_002
Create Date: 2026-10-18

"""

import sqlalchemy as sa

from alembic import op

revision = "v1_004_001"
down_revision = "v1_003_002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "TRANSLATION",
        sa.Column("TRANSLATION_GROUP", sa.String(50), nullable=False),
        sa.Column("TRANSLATION_TYPE", sa.String(50), nullable=False),
        sa.Column("TRANSLATION_CODE", sa.String(50), nullable=False),
        sa.Column(
            "TRANSLATION_LOCALE", sa.String(2), nullable=False, server_default="en"
        ),
        sa.Column("TRANSLATION_CONTENT", sa.String(255), nullable=False),
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
        sa.PrimaryKeyConstraint(
            "TRANSLATION_GROUP",
            "TRANSLATION_TYPE",
            "TRANSLATION_CODE",
            "TRANSLATION_LOCALE",
            name="TB_TRANSLATION_PK",
        ),
    )


def downgrade() -> None:
    op.drop_table("TRANSLATION")
