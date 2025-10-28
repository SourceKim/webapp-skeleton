import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateProductCategoryTables1753669906000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'product_categories',
      columns: [
        { name: 'id', type: 'varchar', length: '36', isPrimary: true },
        { name: 'name', type: 'varchar', length: '50', isNullable: false },
        { name: 'description', type: 'varchar', length: '200', isNullable: true },
        { name: 'parent_id', type: 'varchar', length: '36', isNullable: true },
        { name: 'level', type: 'int', default: 0 },
        { name: 'material_id', type: 'varchar', length: '36', isNullable: true },
        { name: 'status', type: 'enum', enum: ['ENABLED', 'DISABLED'], default: `'ENABLED'` },
        { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        { name: 'deleted_at', type: 'timestamp', isNullable: true },
      ]
    }));

    await queryRunner.createForeignKey('product_categories', new TableForeignKey({
      columnNames: ['parent_id'],
      referencedTableName: 'product_categories',
      referencedColumnNames: ['id'],
      onDelete: 'SET NULL',
    }));

    await queryRunner.createForeignKey('product_categories', new TableForeignKey({
      columnNames: ['material_id'],
      referencedTableName: 'materials',
      referencedColumnNames: ['id'],
      onDelete: 'SET NULL',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('product_categories');
    if (table) {
      for (const fk of table.foreignKeys) {
        await queryRunner.dropForeignKey('product_categories', fk);
      }
    }
    await queryRunner.dropTable('product_categories');
  }
}


