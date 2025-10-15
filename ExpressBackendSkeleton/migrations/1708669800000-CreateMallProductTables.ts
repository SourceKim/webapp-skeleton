import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateMallProductTables1708669800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'products',
      columns: [
        { name: 'id', type: 'varchar', length: '36', isPrimary: true },
        { name: 'name', type: 'varchar', length: '150', isNullable: false },
        { name: 'description', type: 'text', isNullable: true },
        { name: 'price', type: 'decimal', precision: 12, scale: 2, default: 0 },
        { name: 'stock', type: 'int', default: 0 },
        { name: 'status', type: 'enum', enum: ['active', 'inactive'], default: `'active'` },
        { name: 'category_id', type: 'varchar', length: '36', isNullable: true },
        { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        { name: 'deleted_at', type: 'timestamp', isNullable: true },
      ]
    }));

    await queryRunner.createTable(new Table({
      name: 'product_material_relations',
      columns: [
        { name: 'product_id', type: 'varchar', length: '36', isPrimary: true },
        { name: 'material_id', type: 'varchar', length: '36', isPrimary: true },
      ]
    }));

    await queryRunner.createForeignKey('product_material_relations', new TableForeignKey({
      columnNames: ['product_id'],
      referencedTableName: 'products',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE'
    }));

    await queryRunner.createForeignKey('product_material_relations', new TableForeignKey({
      columnNames: ['material_id'],
      referencedTableName: 'materials',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE'
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('product_material_relations');
    if (table) {
      for (const fk of table.foreignKeys) {
        await queryRunner.dropForeignKey('product_material_relations', fk);
      }
    }
    await queryRunner.dropTable('product_material_relations');
    await queryRunner.dropTable('products');
  }
}


