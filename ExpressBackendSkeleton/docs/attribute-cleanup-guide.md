# SKU 属性数据清理和迁移指南

## 概述

本次更新删除了 SKU 属性管理中的无用字段：
- **属性键（product_attribute_keys）**：删除了 `type` 字段
- **属性值（product_attribute_values）**：删除了 `color_hex` 字段
- **自动生成字段**：
  - 属性键的 `key` 字段现在由后端根据 `name` 自动生成
  - 属性值的 `value_id` 字段现在由后端使用 nanoid 自动生成

## 操作步骤

### 1. 备份数据库（重要！）

在执行任何删除操作前，请先备份数据库：

```bash
# 使用 mysqldump 备份（请替换为你的数据库信息）
mysqldump -u your_username -p your_database_name > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. 清理脏数据

由于表结构变更，需要先删除所有 SKU 属性相关的数据。这些数据包括：

#### 需要删除的表数据（按顺序）：

1. **product_sku_attributes** - SKU 属性关联表
   - 存储 SKU 与属性值的关联关系
   - 外键：`attribute_key_id` → `product_attribute_keys.id`
   - 外键：`attribute_value_id` → `product_attribute_values.id`

2. **product_attribute_values** - 属性值表
   - 存储属性值的具体值
   - 外键：`attribute_key_id` → `product_attribute_keys.id`

3. **product_attribute_keys** - 属性键表
   - 存储属性键的定义
   - 外键：`spu_id` → `product_spu.id`

#### 执行清理 SQL

你可以使用提供的清理脚本：

```bash
# 方式1：使用 MySQL 命令行
mysql -u your_username -p your_database_name < scripts/clean-attribute-data.sql

# 方式2：在 MySQL 客户端中执行
mysql -u your_username -p your_database_name
source scripts/clean-attribute-data.sql;
```

或者手动执行以下 SQL：

```sql
-- 删除所有 SKU 属性关联数据
DELETE FROM product_sku_attributes;

-- 删除所有属性值数据
DELETE FROM product_attribute_values;

-- 删除所有属性键数据
DELETE FROM product_attribute_keys;
```

**注意**：如果只想删除特定 SPU 的数据，可以使用：

```sql
-- 删除特定 SPU 的属性数据（替换 'your_spu_id' 为实际的 SPU ID）
DELETE FROM product_sku_attributes 
WHERE sku_id IN (
  SELECT id FROM product_sku WHERE spu_id = 'your_spu_id'
);

DELETE FROM product_attribute_values 
WHERE attribute_key_id IN (
  SELECT id FROM product_attribute_keys WHERE spu_id = 'your_spu_id'
);

DELETE FROM product_attribute_keys WHERE spu_id = 'your_spu_id';
```

### 3. 删除数据库中的旧字段

由于迁移文件已更新，需要手动删除数据库中的旧字段：

```sql
-- 删除 product_attribute_keys 表的 type 字段
ALTER TABLE product_attribute_keys DROP COLUMN type;

-- 删除 product_attribute_values 表的 color_hex 字段
ALTER TABLE product_attribute_values DROP COLUMN color_hex;
```

### 4. 运行迁移

执行 `yarn seed:admin` 会运行所有迁移，但由于表已存在，TypeORM 可能不会重新创建表。

如果遇到表已存在的错误，有两种处理方式：

#### 方式1：删除相关表后重新创建（推荐，如果数据已清理）

```sql
-- 删除表（注意：会删除所有数据！）
DROP TABLE IF EXISTS product_sku_attributes;
DROP TABLE IF EXISTS product_sku_attributes;
DROP TABLE IF EXISTS product_attribute_values;
DROP TABLE IF EXISTS product_attribute_keys;
```

然后运行：

```bash
cd ExpressBackendSkeleton
yarn seed:admin
```

#### 方式2：手动修改表结构（如果不想删除表）

如果表中有其他数据需要保留，可以手动执行：

```sql
-- 如果 type 字段存在，删除它
ALTER TABLE product_attribute_keys DROP COLUMN IF EXISTS type;

-- 如果 color_hex 字段存在，删除它
ALTER TABLE product_attribute_values DROP COLUMN IF EXISTS color_hex;
```

**注意**：MySQL 5.7+ 不支持 `DROP COLUMN IF EXISTS`，需要先检查字段是否存在：

```sql
-- 检查并删除 type 字段（如果存在）
SET @dbname = DATABASE();
SET @tablename = 'product_attribute_keys';
SET @columnname = 'type';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'ALTER TABLE product_attribute_keys DROP COLUMN type',
  'SELECT 1'
));
PREPARE alterIfExists FROM @preparedStatement;
EXECUTE alterIfExists;
DEALLOCATE PREPARE alterIfExists;

-- 检查并删除 color_hex 字段（如果存在）
SET @tablename = 'product_attribute_values';
SET @columnname = 'color_hex';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'ALTER TABLE product_attribute_values DROP COLUMN color_hex',
  'SELECT 1'
));
PREPARE alterIfExists FROM @preparedStatement;
EXECUTE alterIfExists;
DEALLOCATE PREPARE alterIfExists;
```

### 5. 验证迁移结果

运行迁移后，验证表结构是否正确：

```sql
-- 检查 product_attribute_keys 表结构
DESCRIBE product_attribute_keys;
-- 应该看到：id, spu_id, name, key, required, created_at, updated_at, deleted_at
-- 不应该看到：type

-- 检查 product_attribute_values 表结构
DESCRIBE product_attribute_values;
-- 应该看到：id, attribute_key_id, value, value_id, image_id, created_at, updated_at, deleted_at
-- 不应该看到：color_hex
```

## 完整操作流程总结

```bash
# 1. 备份数据库
mysqldump -u your_username -p your_database_name > backup.sql

# 2. 连接数据库并清理数据
mysql -u your_username -p your_database_name
source scripts/clean-attribute-data.sql;

# 3. 删除旧字段（如果存在）
ALTER TABLE product_attribute_keys DROP COLUMN type;
ALTER TABLE product_attribute_values DROP COLUMN color_hex;

# 4. 退出 MySQL，运行迁移
exit
cd ExpressBackendSkeleton
yarn seed:admin
```

## 注意事项

1. **数据备份**：执行删除操作前务必备份数据库
2. **外键约束**：由于外键设置了 CASCADE，删除属性键时会自动删除关联的属性值和 SKU 属性关联
3. **生产环境**：在生产环境执行前，请在测试环境先验证
4. **数据恢复**：如果误删数据，可以使用备份文件恢复

## 后续使用

迁移完成后：
- 新增属性键时，只需输入"名称"和"必选"选项，`key` 字段会自动生成
- 新增属性值时，只需输入"值"，`value_id` 字段会自动生成
- 不再需要选择 `type` 和输入 `color_hex`
