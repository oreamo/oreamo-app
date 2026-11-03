"""insert_role_permission_table

Revision ID: v1_001_007
Revises: v1_001_006
Create Date: 2026-10-18

"""

from alembic import op

revision = "v1_001_007"
down_revision = "v1_001_006"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(r"""
        INSERT INTO TB_ROLE_PERMISSION (ROLE_CODE, PERMISSION_CODE)
        SELECT 'ROLE_SYSTEM', PERMISSION_CODE
          FROM TB_PERMISSION
    """)
    op.execute(r"""
        INSERT INTO TB_ROLE_PERMISSION (ROLE_CODE, PERMISSION_CODE)
        SELECT 'ROLE_ADMIN', PERMISSION_CODE
          FROM TB_PERMISSION
         WHERE PERMISSION_CODE LIKE '%\_READ'
    """)
    op.execute(r"""
        INSERT INTO TB_ROLE_PERMISSION (ROLE_CODE, PERMISSION_CODE)
        VALUES ('ROLE_USER', 'MAIN_READ')
    """)


def downgrade() -> None:
    op.execute("DELETE FROM TB_ROLE_PERMISSION")
