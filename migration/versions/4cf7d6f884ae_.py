"""creates actions table

Revision ID: 4cf7d6f884ae
Revises: e60e32209ce9
Create Date: 2021-04-03 12:18:24.981783

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4cf7d6f884ae'
down_revision = 'e60e32209ce9'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'actions',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('command', sa.String(), nullable=False, unique=True),
        sa.Column('response', sa.String(), nullable=False),
        sa.Column('mention', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(), default=sa.func.now()),
    )


def downgrade():
    op.drop_table('actions')
