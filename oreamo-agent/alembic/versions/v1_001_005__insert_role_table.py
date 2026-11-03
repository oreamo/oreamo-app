"""insert_role_table

Revision ID: v1_001_005
Revises: v1_001_004
Create Date: 2026-10-18

"""

from alembic import op

revision = "v1_001_005"
down_revision = "v1_001_004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(r"""
        INSERT INTO TB_ROLE (ROLE_CODE, ROLE_NAME, SORT_ORDER)
        VALUES ('ROLE_SYSTEM', 'System', 1)
             , ('ROLE_ADMIN', 'Administrator', 2)
             , ('ROLE_USER', 'User', 3)
    """)


def downgrade() -> None:
    op.execute("DELETE FROM TB_ROLE")
