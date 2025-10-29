import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateProductSkuTables1753669908000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'product_sku',
      columns: [
        { name: 'id', type: 'varchar', length: '36', isPrimary: true },
        { name: 'spu_id', type: 'varchar', length: '36', isNullable: false },
        { name: 'sku_code', type: 'varchar', length: '100', isNullable: false },
        { name: 'sku_name', type: 'varchar', length: '500', isNullable: true },
        { name: 'price', type: 'decimal', precision: 10, scale: 2, default: 0 },
        { name: 'original_price', type: 'decimal', precision: 10, scale: 2, isNullable: true },
        { name: 'cost_price', type: 'decimal', precision: 10, scale: 2, isNullable: true },
        { name: 'stock', type: 'int', default: 0 },
        { name: 'status', type: 'enum', enum: ['ON_SHELF', 'OFF_SHELF'], default: `'ON_SHELF'` },
        { name: 'is_default', type: 'boolean', default: false },
        { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        { name: 'deleted_at', type: 'timestamp', isNullable: true },
      ]
    }));

    await queryRunner.createForeignKey('product_sku', new TableForeignKey({
      columnNames: ['spu_id'],
      referencedTableName: 'product_spu',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE'
    }));

    await queryRunner.createIndex('product_sku', new TableIndex({ name: 'idx_product_sku_code', columnNames: ['sku_code'] }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('product_sku');
  }
}


