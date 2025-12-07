import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateMallOrdersTables1753669910000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'mall_orders',
      columns: [
        { name: 'id', type: 'varchar', length: '36', isPrimary: true },
        { name: 'user_id', type: 'varchar', length: '36', isNullable: false },
        { name: 'total_amount', type: 'decimal', precision: 10, scale: 2 },
        { name: 'discount_amount', type: 'decimal', precision: 10, scale: 2, default: 0 },
        { name: 'shipping_amount', type: 'decimal', precision: 10, scale: 2, default: 0 },
        { name: 'payable_amount', type: 'decimal', precision: 10, scale: 2 },
        { name: 'payment_method', type: 'enum', enum: ['ALIPAY','WECHAT','CASH'], isNullable: true },
        { name: 'payment_status', type: 'enum', enum: ['UNPAID','PAID','REFUNDED'], default: `'UNPAID'` },
        { name: 'payment_time', type: 'timestamp', isNullable: true },
        { name: 'delivery_status', type: 'enum', enum: ['PENDING','SHIPPED','DELIVERED'], default: `'PENDING'` },
        { name: 'delivery_time', type: 'timestamp', isNullable: true },
        { name: 'received_time', type: 'timestamp', isNullable: true },
        { name: 'order_status', type: 'enum', enum: ['UNPAID','TO_BE_SHIPPED','SHIPPED','COMPLETED','CANCELED'], default: `'UNPAID'` },
        { name: 'address_id', type: 'varchar', length: '36' },
        { name: 'address_snapshot', type: 'json' },
        { name: 'remark', type: 'varchar', length: '500', isNullable: true },
        { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        { name: 'deleted_at', type: 'timestamp', isNullable: true }
      ]
    }))

    await queryRunner.createForeignKey('mall_orders', new TableForeignKey({
      columnNames: ['user_id'], referencedTableName: 'users', referencedColumnNames: ['id'], onDelete: 'CASCADE'
    }))

    await queryRunner.createIndex('mall_orders', new TableIndex({ name: 'IDX_MALL_ORDERS_USER', columnNames: ['user_id'] }))

    await queryRunner.createTable(new Table({
      name: 'mall_order_items',
      columns: [
        { name: 'id', type: 'varchar', length: '36', isPrimary: true },
        { name: 'order_id', type: 'varchar', length: '36' },
        { name: 'sku_id', type: 'varchar', length: '36' },
        { name: 'sku_snapshot', type: 'json' },
        { name: 'quantity', type: 'int', default: 1 },
        { name: 'unit_price', type: 'decimal', precision: 10, scale: 2 },
        { name: 'total_price', type: 'decimal', precision: 10, scale: 2 },
        { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        { name: 'deleted_at', type: 'timestamp', isNullable: true }
      ]
    }))

    await queryRunner.createForeignKey('mall_order_items', new TableForeignKey({
      columnNames: ['order_id'], referencedTableName: 'mall_orders', referencedColumnNames: ['id'], onDelete: 'CASCADE'
    }))

    // 添加 sku_id 的外键约束，指向 product_sku 表
    await queryRunner.createForeignKey('mall_order_items', new TableForeignKey({
      columnNames: ['sku_id'], referencedTableName: 'product_sku', referencedColumnNames: ['id'], onDelete: 'SET NULL'
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const items = await queryRunner.getTable('mall_order_items')
    if (items) { for (const fk of items.foreignKeys) await queryRunner.dropForeignKey('mall_order_items', fk) }
    await queryRunner.dropTable('mall_order_items', true)
    const orders = await queryRunner.getTable('mall_orders')
    if (orders) { for (const fk of orders.foreignKeys) await queryRunner.dropForeignKey('mall_orders', fk) }
    await queryRunner.dropIndex('mall_orders', 'IDX_MALL_ORDERS_USER')
    await queryRunner.dropTable('mall_orders', true)
  }
}
