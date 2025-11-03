import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateUserAddressTables1754669901000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'user_addresses',
            columns: [
                { name: 'id', type: 'varchar', length: '36', isPrimary: true },
                { name: 'user_id', type: 'varchar', length: '36', isNullable: false },
                { name: 'name', type: 'varchar', length: '50', isNullable: false },
                { name: 'phone', type: 'varchar', length: '20', isNullable: false },
                { name: 'province', type: 'varchar', length: '50', isNullable: false },
                { name: 'city', type: 'varchar', length: '50', isNullable: false },
                { name: 'district', type: 'varchar', length: '50', isNullable: false },
                { name: 'detail', type: 'varchar', length: '200', isNullable: false },
                { name: 'postal_code', type: 'varchar', length: '10', isNullable: true },
                { name: 'is_default', type: 'boolean', default: false },
                { name: 'tag', type: "enum", enum: ['HOME','COMPANY','SCHOOL','OTHER'], isNullable: true },
                { name: 'status', type: "enum", enum: ['ACTIVE','INACTIVE'], default: `'ACTIVE'` },
                { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                { name: 'deleted_at', type: 'timestamp', isNullable: true },
            ]
        }));

        await queryRunner.createForeignKey('user_addresses', new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));

        await queryRunner.createIndex('user_addresses', new TableIndex({
            name: 'idx_user_addresses_user',
            columnNames: ['user_id']
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex('user_addresses', 'idx_user_addresses_user');
        const table = await queryRunner.getTable('user_addresses');
        const fk = table?.foreignKeys.find(f => f.columnNames.includes('user_id'));
        if (fk) await queryRunner.dropForeignKey('user_addresses', fk);
        await queryRunner.dropTable('user_addresses');
    }
}


