"""insert_user_table

Revision ID: v1_001_008
Revises: v1_001_007
Create Date: 2026-10-18

"""

from alembic import op

revision = "v1_001_008"
down_revision = "v1_001_007"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(r"""
        INSERT INTO TB_USER (USERNAME, PASSWORD, ROLE_CODE)
        VALUES ('system', '$2a$10$tkjPFMMFFaOqF8sxakgfqes1yUOjfqSKz9orM0Y190t2tUMBhJKFW', 'ROLE_SYSTEM')
             , ('admin', '$2a$10$tkjPFMMFFaOqF8sxakgfqes1yUOjfqSKz9orM0Y190t2tUMBhJKFW', 'ROLE_ADMIN')
             , ('coztion', '$2a$10$tkjPFMMFFaOqF8sxakgfqes1yUOjfqSKz9orM0Y190t2tUMBhJKFW', 'ROLE_USER')
    """)


def downgrade() -> None:
    op.execute("DELETE FROM TB_USER")
