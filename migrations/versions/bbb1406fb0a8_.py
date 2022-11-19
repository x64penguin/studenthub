"""empty message

Revision ID: bbb1406fb0a8
Revises: 34f7672a2f1c
Create Date: 2022-11-19 13:15:36.595982

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bbb1406fb0a8'
down_revision = '34f7672a2f1c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('token_expiration')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('token_expiration', sa.DATETIME(), nullable=True))

    # ### end Alembic commands ###