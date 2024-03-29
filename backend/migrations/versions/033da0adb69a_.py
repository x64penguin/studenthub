"""empty message

Revision ID: 033da0adb69a
Revises: 3ad81bd249c6
Create Date: 2022-11-30 11:51:50.006088

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '033da0adb69a'
down_revision = '3ad81bd249c6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('test', schema=None) as batch_op:
        batch_op.add_column(sa.Column('avatar', sa.String(length=8), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('test', schema=None) as batch_op:
        batch_op.drop_column('avatar')

    # ### end Alembic commands ###
