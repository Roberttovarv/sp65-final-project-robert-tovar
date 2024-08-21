"""empty message

Revision ID: b0cbb980682b
Revises: c40b8264c627
Create Date: 2024-06-14 17:15:12.238167

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b0cbb980682b'
down_revision = 'c40b8264c627'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('carts', schema=None) as batch_op:
        batch_op.add_column(sa.Column('status', sa.Enum('en proceso', 'cancelado', name='status'), nullable=True))

    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.add_column(sa.Column('status', sa.Enum('pagado', 'cancelado', 'pendiente de pago', name='status'), nullable=True))

    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.add_column(sa.Column('platform', sa.Enum('computer', 'playstation', 'xbox', 'switch', 'mobile', name='platform_enum'), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.drop_column('platform')

    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.drop_column('status')

    with op.batch_alter_table('carts', schema=None) as batch_op:
        batch_op.drop_column('status')

    # ### end Alembic commands ###