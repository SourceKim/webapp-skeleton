import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex, TableColumn } from 'typeorm';

export class CreateMaterialTable1708669700000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'materials',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        length: '36',
                        isPrimary: true
                    },
                    {
                        name: 'filename',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                        comment: '素材文件名'
                    },
                    {
                        name: 'original_name',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                        comment: '素材原始文件名'
                    },
                    {
                        name: 'file_path',
                        type: 'varchar',
                        length: '500',
                        isNullable: true,
                        comment: '素材存储路径'
                    },
                    {
                        name: 'mime_type',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                        comment: '素材MIME类型'
                    },
                    {
                        name: 'file_size',
                        type: 'bigint',
                        isNullable: true,
                        comment: '素材文件大小（字节）'
                    },
                    {
                        name: 'type',
                        type: 'enum',
                        enum: ['image', 'audio', 'video', 'document', 'text', 'avatar', 'other'],
                        default: "'other'",
                        comment: '素材类型'
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                        comment: '素材描述'
                    },
                    {
                        name: 'is_public',
                        type: 'boolean',
                        default: false,
                        comment: '素材是否公开'
                    },
                    {
                        name: 'upload_dir',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                        comment: '素材上传目录'
                    },
                    {
                        name: 'user_id',
                        type: 'varchar',
                        length: '36',
                        isNullable: false,
                        comment: '素材所属用户ID'
                    },
                    {
                        name: 'material_category_id',
                        type: 'varchar',
                        length: '36',
                        isNullable: true,
                        comment: '素材分类ID，关联到material_categories表'
                    },
                    {
                        name: 'metadata',
                        type: 'json',
                        isNullable: true,
                        comment: '素材元数据，存储额外信息'
                    },
                    {
                        name: 'parent_id',
                        type: 'varchar',
                        length: '36',
                        isNullable: true,
                        comment: '父素材ID，用于版本管理'
                    },
                    {
                        name: 'access_count',
                        type: 'int',
                        default: 0,
                        comment: '访问计数'
                    },
                    {
                        name: 'file_hash',
                        type: 'varchar',
                        length: '64',
                        isNullable: true,
                        comment: '文件哈希值，用于检测重复文件'
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

        // 创建材料分类表
        await queryRunner.createTable(
            new Table({
                name: 'material_categories',
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
                        length: '50',
                        isNullable: false,
                        isUnique: true,
                        comment: '分类名称'
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        length: '200',
                        isNullable: true,
                        comment: '分类描述'
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

        // 创建材料标签表
        await queryRunner.createTable(
            new Table({
                name: 'material_tags',
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
                        length: '50',
                        isNullable: false,
                        isUnique: true,
                        comment: '标签名称'
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        length: '200',
                        isNullable: true,
                        comment: '标签描述'
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

        // 创建素材标签关联表（多对多关系）
        await queryRunner.createTable(
            new Table({
                name: 'material_tag_relations',
                columns: [
                    {
                        name: 'material_id',
                        type: 'varchar',
                        length: '36',
                        isPrimary: true
                    },
                    {
                        name: 'tag_id',
                        type: 'varchar',
                        length: '36',
                        isPrimary: true
                    }
                ]
            }),
            true
        );

        // 添加外键约束
        await queryRunner.createForeignKey(
            'materials',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE'
            })
        );

        await queryRunner.createForeignKey(
            'materials',
            new TableForeignKey({
                columnNames: ['material_category_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'material_categories',
                onDelete: 'SET NULL'
            })
        );

        await queryRunner.createForeignKey(
            'material_tag_relations',
            new TableForeignKey({
                columnNames: ['material_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'materials',
                onDelete: 'CASCADE'
            })
        );

        await queryRunner.createForeignKey(
            'material_tag_relations',
            new TableForeignKey({
                columnNames: ['tag_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'material_tags',
                onDelete: 'CASCADE'
            })
        );

        // 创建索引
        await queryRunner.createIndex(
            'materials',
            new TableIndex({
                name: 'IDX_MATERIALS_TYPE_USER',
                columnNames: ['type', 'user_id']
            })
        );

        await queryRunner.createIndex(
            'materials',
            new TableIndex({
                name: 'IDX_MATERIALS_CREATED_AT',
                columnNames: ['created_at']
            })
        );

        await queryRunner.createIndex(
            'materials',
            new TableIndex({
                name: 'IDX_MATERIALS_IS_PUBLIC',
                columnNames: ['is_public']
            })
        );

        await queryRunner.createIndex(
            'material_categories',
            new TableIndex({
                name: 'IDX_MATERIAL_CATEGORIES_NAME',
                columnNames: ['name']
            })
        );

        await queryRunner.createIndex(
            'material_tags',
            new TableIndex({
                name: 'IDX_MATERIAL_TAGS_NAME',
                columnNames: ['name']
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 删除外键约束
        const materialTable = await queryRunner.getTable('materials');
        if (materialTable) {
            const foreignKeys = materialTable.foreignKeys;
            for (const foreignKey of foreignKeys) {
                await queryRunner.dropForeignKey('materials', foreignKey);
            }
        }

        const materialTagRelationsTable = await queryRunner.getTable('material_tag_relations');
        if (materialTagRelationsTable) {
            const foreignKeys = materialTagRelationsTable.foreignKeys;
            for (const foreignKey of foreignKeys) {
                await queryRunner.dropForeignKey('material_tag_relations', foreignKey);
            }
        }

        // 删除索引
        await queryRunner.dropIndex('materials', 'IDX_MATERIALS_TYPE_USER');
        await queryRunner.dropIndex('materials', 'IDX_MATERIALS_CREATED_AT');
        await queryRunner.dropIndex('materials', 'IDX_MATERIALS_IS_PUBLIC');
        await queryRunner.dropIndex('material_categories', 'IDX_MATERIAL_CATEGORIES_NAME');
        await queryRunner.dropIndex('material_tags', 'IDX_MATERIAL_TAGS_NAME');

        // 删除表
        await queryRunner.dropTable('material_tag_relations', true);
        await queryRunner.dropTable('materials', true);
        await queryRunner.dropTable('material_categories', true);
        await queryRunner.dropTable('material_tags', true);
    }
} 