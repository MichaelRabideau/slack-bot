"""create custom response tables

Revision ID: f1b26018e7d3
Revises: 4cf7d6f884ae
Create Date: 2021-04-03 22:23:07.547575

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f1b26018e7d3'
down_revision = '4cf7d6f884ae'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'custom_responses',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('created_at', sa.DateTime(), default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(),
                  default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('edited_by', sa.String)
    )
    op.create_table(
        'custom_response_commands',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('command', sa.String),
        sa.Column('mention', sa.Boolean),
        sa.Column('exact', sa.Boolean),
        sa.Column('created_at', sa.DateTime(), default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(),
                  default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('custom_response_id', sa.Integer,
                  sa.ForeignKey('custom_responses.id'))
    )
    op.create_table(
        'custom_response_replies',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('created_at', sa.DateTime(), default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(),
                  default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('reply', sa.String),
        sa.Column('custom_response_id', sa.Integer,
                  sa.ForeignKey('custom_responses.id'))
    )


def downgrade():
    op.drop_table('custom_response_commands')
    op.drop_table('custom_response_replies')
    op.drop_table('custom_responses')
