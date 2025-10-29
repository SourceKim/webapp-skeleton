import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateProductSpuTables1753669907000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'product_spu',
      columns: [
        { name: 'id', type: 'varchar', length: '36', isPrimary: true },
        { name: 'name', type: 'varchar', length: '255', isNullable: false },
        { name: 'sub_title', type: 'varchar', length: '500', isNullable: true },
        { name: 'description', type: 'text', isNullable: true },
        { name: 'category_id', type: 'varchar', length: '36', isNullable: true },
        { name: 'brand_id', type: 'varchar', length: '36', isNullable: true },
        { name: 'status', type: 'enum', enum: ['DRAFT', 'ON_SHELF', 'OFF_SHELF'], default: `'DRAFT'` },
        { name: 'main_material', type: 'varchar', length: '36', isNullable: true },
        // sub materials moved to join table
        { name: 'detail_content', type: 'text', isNullable: true },
        { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        { name: 'deleted_at', type: 'timestamp', isNullable: true },
      ]
    }));

    await queryRunner.createForeignKey('product_spu', new TableForeignKey({
      columnNames: ['category_id'],
      referencedTableName: 'product_categories',
      referencedColumnNames: ['id'],
      onDelete: 'SET NULL'
    }));
    await queryRunner.createForeignKey('product_spu', new TableForeignKey({
      columnNames: ['brand_id'],
      referencedTableName: 'product_brands',
      referencedColumnNames: ['id'],
      onDelete: 'SET NULL'
    }));
    await queryRunner.createForeignKey('product_spu', new TableForeignKey({
      columnNames: ['main_material'],
      referencedTableName: 'materials',
      referencedColumnNames: ['id'],
      onDelete: 'SET NULL'
    }));

    // Join table for sub materials
    await queryRunner.createTable(new Table({
      name: 'product_spu_sub_materials',
      columns: [
        { name: 'spu_id', type: 'varchar', length: '36', isPrimary: true },
        { name: 'material_id', type: 'varchar', length: '36', isPrimary: true },
      ]
    }));
    await queryRunner.createForeignKey('product_spu_sub_materials', new TableForeignKey({
      columnNames: ['spu_id'],
      referencedTableName: 'product_spu',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE'
    }));
    await queryRunner.createForeignKey('product_spu_sub_materials', new TableForeignKey({
      columnNames: ['material_id'],
      referencedTableName: 'materials',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE'
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('product_spu');
    if (table) {
      for (const fk of table.foreignKeys) {
        await queryRunner.dropForeignKey('product_spu', fk);
      }
    }
    await queryRunner.dropTable('product_spu_sub_materials');
    await queryRunner.dropTable('product_spu');
  }
}


