import { DataSource } from 'typeorm';
import { ENV } from './env.config';

// 实体 models
import { User } from '@/modules/user/user.model';
import { Permission } from '@/modules/permission/permission.model';
import { Role } from '@/modules/role/role.model';;
import { Material } from '@/modules/material/material.model';
import { MaterialCategory } from '@/modules/material/mateial-category/material-category.model';
import { MaterialTag } from '@/modules/material/mateial-tag/material-tag.model';
import { ProductBrand } from '@/modules/product/brand/product-brand.model';
import { ProductCategory } from '@/modules/product/category/product-category.model';
import { ProductSpu } from '@/modules/product/spu/product-spu.model';
import { ProductSku } from '@/modules/product/sku/product-sku.model';
import { ProductAttributeKey } from '@/modules/product/attribute/product-attribute-key.model';
import { ProductAttributeValue } from '@/modules/product/attribute/product-attribute-value.model';
import { ProductSkuAttribute } from '@/modules/product/attribute/product-sku-attribute.model';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: ENV.MYSQL_HOST,
    port: parseInt(ENV.MYSQL_PORT),
    username: ENV.MYSQL_USER,
    password: ENV.MYSQL_PASSWORD,  // 处理空密码的情况
    database: ENV.MYSQL_DATABASE,
    synchronize: false, // 禁用自动同步以避免数据结构冲突
    logging: true, // 开启数据库查询日志
    extra: {
        decimalNumbers: true
    },
    entities: [
        User, 
        Permission,
        Role,
        Material,
        MaterialCategory,
        MaterialTag,
        ProductBrand,
        ProductCategory,
        ProductSpu,
        ProductSku,
        ProductAttributeKey,
        ProductAttributeValue,
        ProductSkuAttribute
    ],
    migrations: ['migrations/*.ts'],
    subscribers: [],
    charset: 'utf8mb4'
}); 