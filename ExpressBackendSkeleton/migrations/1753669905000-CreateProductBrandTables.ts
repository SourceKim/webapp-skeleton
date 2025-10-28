import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateProductBrandTables1753669905000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'product_brands',
      columns: [
        { name: 'id', type: 'varchar', length: '36', isPrimary: true },
        { name: 'name', type: 'varchar', length: '50', isNullable: false },
        { name: 'description', type: 'varchar', length: '200', isNullable: true },
        { name: 'material_id', type: 'varchar', length: '36', isNullable: true },
        { name: 'website', type: 'varchar', length: '200', isNullable: true },
        { name: 'status', type: 'enum', enum: ['ENABLED', 'DISABLED'], default: `'ENABLED'` },
        { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        { name: 'deleted_at', type: 'timestamp', isNullable: true },
      ],
      uniques: [
        { name: 'uniq_product_brand_name', columnNames: ['name'] }
      ]
    }));

    await queryRunner.createForeignKey('product_brands', new TableForeignKey({
      columnNames: ['material_id'],
      referencedTableName: 'materials',
      referencedColumnNames: ['id'],
      onDelete: 'SET NULL',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('product_brands');
    if (table) {
      for (const fk of table.foreignKeys) {
        await queryRunner.dropForeignKey('product_brands', fk);
      }
    }
    await queryRunner.dropTable('product_brands');
  }
}


