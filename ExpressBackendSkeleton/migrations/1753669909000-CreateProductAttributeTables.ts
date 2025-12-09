import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateProductAttributeTables1753669909000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'product_attribute_keys',
      columns: [
        { name: 'id', type: 'varchar', length: '36', isPrimary: true },
        { name: 'spu_id', type: 'varchar', length: '36', isNullable: false },
        { name: 'name', type: 'varchar', length: '50' },
        { name: 'key', type: 'varchar', length: '50' },
        { name: 'required', type: 'boolean', default: false },
        { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        { name: 'deleted_at', type: 'timestamp', isNullable: true },
      ]
    }));
    await queryRunner.createForeignKey('product_attribute_keys', new TableForeignKey({
      columnNames: ['spu_id'],
      referencedTableName: 'product_spu',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE'
    }));

    await queryRunner.createTable(new Table({
      name: 'product_attribute_values',
      columns: [
        { name: 'id', type: 'varchar', length: '36', isPrimary: true },
        { name: 'attribute_key_id', type: 'varchar', length: '36' },
        { name: 'value', type: 'varchar', length: '100' },
        { name: 'value_id', type: 'varchar', length: '100' },
        { name: 'image_id', type: 'varchar', length: '36', isNullable: true },
        { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        { name: 'deleted_at', type: 'timestamp', isNullable: true },
      ]
    }));
    await queryRunner.createForeignKey('product_attribute_values', new TableForeignKey({
      columnNames: ['attribute_key_id'],
      referencedTableName: 'product_attribute_keys',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE'
    }));
    await queryRunner.createForeignKey('product_attribute_values', new TableForeignKey({
      columnNames: ['image_id'],
      referencedTableName: 'materials',
      referencedColumnNames: ['id'],
      onDelete: 'SET NULL'
    }));

    await queryRunner.createTable(new Table({
      name: 'product_sku_attributes',
      columns: [
        { name: 'id', type: 'varchar', length: '36', isPrimary: true },
        { name: 'sku_id', type: 'varchar', length: '36' },
        { name: 'attribute_key_id', type: 'varchar', length: '36' },
        { name: 'attribute_value_id', type: 'varchar', length: '36' },
        { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        { name: 'deleted_at', type: 'timestamp', isNullable: true },
      ]
    }));
    await queryRunner.createForeignKey('product_sku_attributes', new TableForeignKey({
      columnNames: ['sku_id'],
      referencedTableName: 'product_sku',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE'
    }));
    await queryRunner.createForeignKey('product_sku_attributes', new TableForeignKey({
      columnNames: ['attribute_key_id'],
      referencedTableName: 'product_attribute_keys',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE'
    }));
    await queryRunner.createForeignKey('product_sku_attributes', new TableForeignKey({
      columnNames: ['attribute_value_id'],
      referencedTableName: 'product_attribute_values',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE'
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('product_sku_attributes');
    await queryRunner.dropTable('product_attribute_values');
    await queryRunner.dropTable('product_attribute_keys');
  }
}


