"""insert_permission_table

Revision ID: v1_001_006
Revises: v1_001_005
Create Date: 2026-10-18

"""

from alembic import op

revision = "v1_001_006"
down_revision = "v1_001_005"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(r"""
        INSERT INTO TB_PERMISSION (PERMISSION_CODE, PERMISSION_NAME, SORT_ORDER)
        VALUES ('MAIN_READ', 'Main Read', 100)
             , ('CODE_MANAGEMENT_READ', 'Code Management Read', 810)
             , ('CODE_MANAGEMENT_WRITE', 'Code Management Write', 811)
             , ('MENU_MANAGEMENT_READ', 'Menu Management Read', 820)
             , ('MENU_MANAGEMENT_WRITE', 'Menu Management Write', 821)
             , ('USER_MANAGEMENT_READ', 'User Management Read', 830)
             , ('USER_MANAGEMENT_WRITE', 'User Management Write', 831)
             , ('AUTHORITY_MANAGEMENT_READ', 'Authority Management Read', 835)
             , ('AUTHORITY_MANAGEMENT_WRITE', 'Authority Management Write', 836)
             , ('TRANSLATION_MANAGEMENT_READ', 'Translation Management Read', 840)
             , ('TRANSLATION_MANAGEMENT_WRITE', 'Translation Management Write', 841)
             , ('DEV_READ', 'Development Read', 900)
    """)


def downgrade() -> None:
    op.execute("DELETE FROM TB_PERMISSION")
