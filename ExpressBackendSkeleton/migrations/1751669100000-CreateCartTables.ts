import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateCartTables1751669100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // carts
    await queryRunner.createTable(
      new Table({
        name: 'carts',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          { name: 'user_id', type: 'varchar', length: '36', isNullable: false, comment: '用户ID' },
          { name: 'total_price', type: 'decimal', precision: 12, scale: 2, default: 0, comment: '购物车总价' },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
          { name: 'deleted_at', type: 'timestamp', isNullable: true }
        ]
      }),
      true
    );

    await queryRunner.createForeignKey(
      'carts',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );

    await queryRunner.createIndex(
      'carts',
      new TableIndex({ name: 'uniq_cart_user_id', columnNames: ['user_id'], isUnique: true })
    );

    // cart_items
    await queryRunner.createTable(
      new Table({
        name: 'cart_items',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          { name: 'cart_id', type: 'varchar', length: '36', isNullable: false },
          { name: 'product_id', type: 'varchar', length: '36', isNullable: false },
          { name: 'quantity', type: 'int', default: 1 },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
          { name: 'deleted_at', type: 'timestamp', isNullable: true }
        ]
      }),
      true
    );

    await queryRunner.createForeignKey(
      'cart_items',
      new TableForeignKey({
        columnNames: ['cart_id'],
        referencedTableName: 'carts',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );

    await queryRunner.createForeignKey(
      'cart_items',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );

    await queryRunner.createIndex(
      'cart_items',
      new TableIndex({ name: 'uniq_cart_product', columnNames: ['cart_id', 'product_id'], isUnique: true })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // drop cart_items FKs and indexes
    const cartItemsTable = await queryRunner.getTable('cart_items');
    if (cartItemsTable) {
      for (const fk of cartItemsTable.foreignKeys) {
        await queryRunner.dropForeignKey('cart_items', fk);
      }
    }
    await queryRunner.dropIndex('cart_items', 'uniq_cart_product');
    await queryRunner.dropTable('cart_items', true);

    // drop carts FKs and indexes
    const cartsTable = await queryRunner.getTable('carts');
    if (cartsTable) {
      for (const fk of cartsTable.foreignKeys) {
        await queryRunner.dropForeignKey('carts', fk);
      }
    }
    await queryRunner.dropIndex('carts', 'uniq_cart_user_id');
    await queryRunner.dropTable('carts', true);
  }
}



