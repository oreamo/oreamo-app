"""insert_file_translation_table

Revision ID: v1_005_002
Revises: v1_005_001
Create Date: 2026-10-18

"""

from alembic import op

revision = "v1_005_002"
down_revision = "v1_005_001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(r"""
        INSERT INTO TRANSLATION(TRANSLATION_GROUP, TRANSLATION_TYPE, TRANSLATION_CODE, TRANSLATION_LOCALE, TRANSLATION_CONTENT)
        VALUES ('FILE', 'LABEL', 'FILES', 'EN', 'Files')
    """)


def downgrade() -> None:
    op.execute(
        "DELETE FROM TRANSLATION WHERE TRANSLATION_GROUP = 'FILE' AND TRANSLATION_TYPE = 'LABEL' AND TRANSLATION_CODE = 'FILES'"
    )
