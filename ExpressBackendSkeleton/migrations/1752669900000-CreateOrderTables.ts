import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateOrderTables1752669900000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // orders
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          { name: 'user_id', type: 'varchar', length: '36', isNullable: false, comment: '用户ID' },
          { name: 'status', type: 'enum', enum: ['pending', 'confirmed', 'shipped', 'completed', 'canceled'], default: `'pending'` },
          { name: 'total_price', type: 'decimal', precision: 12, scale: 2, default: 0, comment: '订单总价' },
          { name: 'address', type: 'varchar', length: '200', isNullable: true, comment: '收货地址' },
          { name: 'shipping_no', type: 'varchar', length: '200', isNullable: true, comment: '物流单号' },
          { name: 'remark', type: 'text', isNullable: true },
          { name: 'paid_at', type: 'timestamp', isNullable: true },
          { name: 'shipped_at', type: 'timestamp', isNullable: true },
          { name: 'completed_at', type: 'timestamp', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
          { name: 'deleted_at', type: 'timestamp', isNullable: true }
        ]
      }),
      true
    );

    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );

    await queryRunner.createIndex(
      'orders',
      new TableIndex({ name: 'IDX_ORDERS_USER_ID', columnNames: ['user_id'] })
    );

    // order_items
    await queryRunner.createTable(
      new Table({
        name: 'order_items',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          { name: 'order_id', type: 'varchar', length: '36', isNullable: false },
          { name: 'product_id', type: 'varchar', length: '36', isNullable: true },
          { name: 'quantity', type: 'int', default: 1 },
          { name: 'unit_price', type: 'decimal', precision: 12, scale: 2, default: 0 },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
          { name: 'deleted_at', type: 'timestamp', isNullable: true }
        ]
      }),
      true
    );

    await queryRunner.createForeignKey(
      'order_items',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedTableName: 'orders',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );

    await queryRunner.createForeignKey(
      'order_items',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const orderItems = await queryRunner.getTable('order_items');
    if (orderItems) {
      for (const fk of orderItems.foreignKeys) {
        await queryRunner.dropForeignKey('order_items', fk);
      }
    }
    await queryRunner.dropTable('order_items', true);

    const orders = await queryRunner.getTable('orders');
    if (orders) {
      for (const fk of orders.foreignKeys) {
        await queryRunner.dropForeignKey('orders', fk);
      }
    }
    await queryRunner.dropIndex('orders', 'IDX_ORDERS_USER_ID');
    await queryRunner.dropTable('orders', true);
  }
}


