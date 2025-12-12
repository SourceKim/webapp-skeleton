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
import { UserAddress } from '@/modules/user/address/user-address.model';
import { Cart } from '@/modules/mall/cart/cart.model';
import { MallOrder, MallOrderItem } from '@/modules/mall/order/order.model';
import { Carousel } from '@/modules/mall/carousel/carousel.model';
import { ShopIntro, ShopIntroBanner } from '@/modules/mall/shop-intro/shop-intro.model';

/**
 * TypeORM 日志配置
 * 根据环境变量控制日志详细程度
 */
const getDatabaseLogging = (): boolean | Array<'query' | 'error' | 'schema' | 'warn' | 'info' | 'log'> => {
  // 如果明确设置为 false，则不输出日志
  if (ENV.DB_LOGGING === false) {
    return false;
  }
  
  // 开发环境：输出查询、错误和警告
  if (ENV.NODE_ENV === 'development') {
    return ['query', 'error', 'warn'];
  }
  
  // 生产环境：只输出错误和警告（不输出查询日志）
  return ['error', 'warn'];
};

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: ENV.MYSQL_HOST,
    port: ENV.MYSQL_PORT,  // 已经是 number 类型，无需 parseInt
    username: ENV.MYSQL_USER,
    password: ENV.MYSQL_PASSWORD,  // 处理空密码的情况
    database: ENV.MYSQL_DATABASE,
    synchronize: false, // 禁用自动同步以避免数据结构冲突
    logging: getDatabaseLogging(), // 根据环境变量控制数据库查询日志
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
        ,UserAddress
        ,Cart
        ,MallOrder
        ,MallOrderItem
        ,Carousel
        ,ShopIntro
        ,ShopIntroBanner
    ],
    migrations: ['migrations/**/*.ts'], // 迁移文件路径，支持 ts-node 运行时加载
    subscribers: [],
    charset: 'utf8mb4'
}); 