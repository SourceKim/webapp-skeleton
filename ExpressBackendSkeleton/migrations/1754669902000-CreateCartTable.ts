import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateCartTable1754669902000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 确保 user 表存在（已由早期迁移创建）
    // 确保 product_sku 表存在（已由 1753... 创建）

    await queryRunner.createTable(new Table({
      name: 'cart',
      columns: [
        { name: 'id', type: 'varchar', length: '36', isPrimary: true },
        { name: 'user_id', type: 'varchar', length: '36', isNullable: false },
        { name: 'sku_id', type: 'varchar', length: '36', isNullable: false },
        { name: 'quantity', type: 'int', default: 1 },
        { name: 'selected', type: 'boolean', default: true },
        { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        { name: 'deleted_at', type: 'timestamp', isNullable: true }
      ]
    }));

    await queryRunner.createForeignKey('cart', new TableForeignKey({
      columnNames: ['user_id'],
      referencedTableName: 'users',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE'
    }));

    await queryRunner.createForeignKey('cart', new TableForeignKey({
      columnNames: ['sku_id'],
      referencedTableName: 'product_sku',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE'
    }));

    await queryRunner.createIndex('cart', new TableIndex({ name: 'uniq_cart_user_sku', columnNames: ['user_id', 'sku_id'], isUnique: true }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('cart');
    if (table) {
      const foreignKeys = table.foreignKeys;
      for (const foreignKey of foreignKeys) {
        await queryRunner.dropForeignKey('cart', foreignKey);
      }
      await queryRunner.dropIndex('cart', 'uniq_cart_user_sku');
      await queryRunner.dropTable('cart');
    }
  }
}



