"""insert_group_code_table

Revision ID: v1_002_003
Revises: v1_002_002
Create Date: 2026-10-18

"""

from alembic import op

revision = "v1_002_003"
down_revision = "v1_002_002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(r"""
        INSERT INTO TB_GROUP_CODE(GROUP_CODE, GROUP_CODE_NAME, GROUP_CODE_DESC, DATA_STATUS, SORT_ORDER)
        VALUES ('DATA_STATUS', 'Data Status', 'Data status', 'ENABLED', 1)
             , ('MENU_TYPE', 'Menu Type', 'Menu Type', 'ENABLED', 2)
             , ('TRANSLATION_GROUP', 'Translation Group', 'Translation Group', 'ENABLED', 3)
             , ('TRANSLATION_TYPE', 'Translation Type', 'Translation Type(LABEL/MESSAGE)', 'ENABLED', 4)
             , ('TRANSLATION_LOCALE', 'Translation Locale', 'Translation Locale(Language Code)', 'ENABLED', 5)
    """)


def downgrade() -> None:
    op.execute("DELETE FROM TB_GROUP_CODE")
