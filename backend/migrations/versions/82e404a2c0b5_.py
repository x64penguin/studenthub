"""empty message

Revision ID: 82e404a2c0b5
Revises: c06c65306e40
Create Date: 2023-01-17 12:07:39.064333

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '82e404a2c0b5'
down_revision = 'c06c65306e40'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('test_solution',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('test_id', sa.Integer(), nullable=True),
    sa.Column('start_time', sa.DateTime(), nullable=True),
    sa.Column('end_time', sa.DateTime(), nullable=True),
    sa.Column('in_progress', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['test_id'], ['test.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('test', schema=None) as batch_op:
        batch_op.drop_column('uuid')
        batch_op.drop_column('avatar')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('test', schema=None) as batch_op:
        batch_op.add_column(sa.Column('avatar', sa.VARCHAR(length=8), nullable=True))
        batch_op.add_column(sa.Column('uuid', sa.VARCHAR(length=32), nullable=True))

    op.drop_table('test_solution')
    # ### end Alembic commands ###