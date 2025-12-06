import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateHomeTables1755669901000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create Carousel Table
        await queryRunner.createTable(
            new Table({
                name: 'carousels',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        length: '36',
                        isPrimary: true
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                        comment: '轮播图标题'
                    },
                    {
                        name: 'material_id',
                        type: 'varchar',
                        length: '36',
                        isNullable: false,
                        comment: '关联图片素材ID'
                    },
                    {
                        name: 'spu_id',
                        type: 'varchar',
                        length: '36',
                        isNullable: true,
                        comment: '关联商品SPU ID'
                    },
                    {
                        name: 'sort_order',
                        type: 'int',
                        default: 0,
                        comment: '排序权重'
                    },
                    {
                        name: 'is_active',
                        type: 'boolean',
                        default: true,
                        comment: '是否启用'
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP'
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP'
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ['material_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'materials',
                        onDelete: 'CASCADE'
                    },
                    {
                        columnNames: ['spu_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'product_spu',
                        onDelete: 'SET NULL'
                    }
                ]
            }),
            true
        );

        // Create ShopIntro Table
        await queryRunner.createTable(
            new Table({
                name: 'shop_intros',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        length: '36',
                        isPrimary: true
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                        comment: '店铺名称'
                    },
                    {
                        name: 'introduction',
                        type: 'varchar',
                        length: '500',
                        isNullable: true,
                        comment: '店铺简介'
                    },
                    {
                        name: 'detail',
                        type: 'text',
                        isNullable: true,
                        comment: '店铺详情'
                    },
                    {
                        name: 'contact_phone',
                        type: 'varchar',
                        length: '20',
                        isNullable: true,
                        comment: '联系电话'
                    },
                    {
                        name: 'longitude',
                        type: 'decimal',
                        precision: 10,
                        scale: 6,
                        isNullable: true,
                        comment: '经度'
                    },
                    {
                        name: 'latitude',
                        type: 'decimal',
                        precision: 10,
                        scale: 6,
                        isNullable: true,
                        comment: '纬度'
                    },
                    {
                        name: 'address',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                        comment: '详细地址'
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP'
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP'
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true
                    }
                ]
            }),
            true
        );

        // Create ShopIntroBanners Table (Many-to-Many with order)
        await queryRunner.createTable(
            new Table({
                name: 'shop_intro_banners',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        length: '36',
                        isPrimary: true
                    },
                    {
                        name: 'shop_intro_id',
                        type: 'varchar',
                        length: '36',
                        isNullable: false
                    },
                    {
                        name: 'material_id',
                        type: 'varchar',
                        length: '36',
                        isNullable: false
                    },
                    {
                        name: 'sort_order',
                        type: 'int',
                        default: 0
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP'
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP'
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ['shop_intro_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'shop_intros',
                        onDelete: 'CASCADE'
                    },
                    {
                        columnNames: ['material_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'materials',
                        onDelete: 'CASCADE'
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('shop_intro_banners', true);
        await queryRunner.dropTable('shop_intros', true);
        await queryRunner.dropTable('carousels', true);
    }
}
