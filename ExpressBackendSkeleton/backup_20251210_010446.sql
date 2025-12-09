Enter password: -- MySQL dump 10.13  Distrib 9.2.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: skeleton
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `carousels`
--

DROP TABLE IF EXISTS `carousels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carousels` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '轮播图标题',
  `material_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '关联图片素材ID',
  `spu_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '关联商品SPU ID',
  `sort_order` int NOT NULL DEFAULT '0' COMMENT '排序权重',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_31f94e6c9527032620eab157c35` (`material_id`),
  CONSTRAINT `FK_31f94e6c9527032620eab157c35` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carousels`
--

LOCK TABLES `carousels` WRITE;
/*!40000 ALTER TABLE `carousels` DISABLE KEYS */;
INSERT INTO `carousels` VALUES ('900QPIKsrBpUeSvmDe0Qr','3','84sTi7gEh0qKJPry7jX6L','H5kbL0OUq3IJZTpu',3,1,'2025-11-29 19:42:11','2025-11-29 19:42:11',NULL),('N5Y0WnVbDGGXjyp1xl0la','2','Ej-4u4hj5IMd2724yTjI3','H5kbL0OUq3IJZTpu',1,1,'2025-11-29 19:42:01','2025-11-29 19:42:01',NULL),('v2hokVxydRjI4yqlTI4Ge','11','NZbKAjB-Fhf9SHJtNyWgf','H5kbL0OUq3IJZTpu',0,1,'2025-11-29 19:41:50','2025-11-29 19:41:50',NULL);
/*!40000 ALTER TABLE `carousels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `selected` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_cart_user_sku` (`user_id`,`sku_id`),
  KEY `FK_c86dd00d46da9e7c829dd102dfb` (`sku_id`),
  CONSTRAINT `FK_c86dd00d46da9e7c829dd102dfb` FOREIGN KEY (`sku_id`) REFERENCES `product_sku` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_f091e86a234693a49084b4c2c86` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES ('uw6mRZKYQ_MoNhaA','fb1h2gvxin16ejnt','wAM3h2ADglga3aP1',3,1,'2025-11-30 11:42:21','2025-12-04 16:56:19',NULL);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mall_order_items`
--

DROP TABLE IF EXISTS `mall_order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mall_order_items` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku_snapshot` json NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_d78e30a3d6027676b11cbda51b4` (`order_id`),
  CONSTRAINT `FK_d78e30a3d6027676b11cbda51b4` FOREIGN KEY (`order_id`) REFERENCES `mall_orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mall_order_items`
--

LOCK TABLES `mall_order_items` WRITE;
/*!40000 ALTER TABLE `mall_order_items` DISABLE KEYS */;
INSERT INTO `mall_order_items` VALUES ('UGts5H13Ric5IwzM','foxnJmm2Wzl-DWon','E7z9v5nC43HJZfQ9','{\"id\": \"E7z9v5nC43HJZfQ9\", \"spu\": {\"id\": \"VOLQEbc3N5V6cAlL\", \"name\": \"八爪鱼\", \"sub_title\": null, \"main_material\": {\"file_path\": \"images/八爪鱼商品图_1764433446430_99ct4w0ez.jpeg\"}}, \"price\": 10, \"attributes\": [{\"value\": \"巨辣\", \"key_id\": \"5PfPHnMEkRsFJ_61\", \"key_name\": \"辣\", \"value_id\": \"very-spicy\"}]}',4,10.00,40.00,'2025-11-29 17:21:54','2025-11-29 17:21:54',NULL),('W06WxQfu0KBaI2Y2','Hf9RCfSRUHh1uxh3','wAM3h2ADglga3aP1','{\"id\": \"wAM3h2ADglga3aP1\", \"spu\": {\"id\": \"H5kbL0OUq3IJZTpu\", \"name\": \"牛排\", \"sub_title\": null, \"main_material\": {\"file_path\": \"images/牛肉商品图_1764433470245_x7x6s01sh.jpeg\"}}, \"price\": 0, \"attributes\": []}',2,0.00,0.00,'2025-11-29 17:07:18','2025-11-29 17:07:18',NULL);
/*!40000 ALTER TABLE `mall_order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mall_orders`
--

DROP TABLE IF EXISTS `mall_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mall_orders` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `shipping_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `payable_amount` decimal(10,2) NOT NULL,
  `payment_method` enum('ALIPAY','WECHAT','CASH') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` enum('UNPAID','PAID','REFUNDED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UNPAID',
  `payment_time` timestamp NULL DEFAULT NULL,
  `delivery_status` enum('PENDING','SHIPPED','DELIVERED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `delivery_time` timestamp NULL DEFAULT NULL,
  `received_time` timestamp NULL DEFAULT NULL,
  `order_status` enum('UNPAID','TO_BE_SHIPPED','SHIPPED','COMPLETED','CANCELED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UNPAID',
  `address_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_snapshot` json NOT NULL,
  `remark` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_MALL_ORDERS_USER` (`user_id`),
  CONSTRAINT `FK_49dab1e1075dcce967aa8eb52a2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mall_orders`
--

LOCK TABLES `mall_orders` WRITE;
/*!40000 ALTER TABLE `mall_orders` DISABLE KEYS */;
INSERT INTO `mall_orders` VALUES ('foxnJmm2Wzl-DWon','fb1h2gvxin16ejnt',40.00,0.00,0.00,40.00,'CASH','PAID','2025-11-29 17:21:55','DELIVERED','2025-11-29 17:22:09','2025-12-02 16:41:21','COMPLETED','wOjXg_jQB2odVRUc','{\"city\": \"市辖区\", \"name\": \"kim\", \"town\": \"新街口街道\", \"phone\": \"13000000000\", \"detail\": \"11\", \"country\": \"西城区\", \"province\": \"北京市\", \"postal_code\": \"\"}',NULL,'2025-11-29 17:21:54','2025-12-02 16:41:21',NULL),('Hf9RCfSRUHh1uxh3','fb1h2gvxin16ejnt',0.00,0.00,0.00,0.00,'CASH','PAID','2025-11-29 17:07:18','DELIVERED','2025-11-29 17:07:34','2025-11-29 17:13:33','COMPLETED','wOjXg_jQB2odVRUc','{\"city\": \"市辖区\", \"name\": \"kim\", \"town\": \"新街口街道\", \"phone\": \"13000000000\", \"detail\": \"11\", \"country\": \"西城区\", \"province\": \"北京市\", \"postal_code\": \"\"}',NULL,'2025-11-29 17:07:18','2025-11-29 17:13:33',NULL);
/*!40000 ALTER TABLE `mall_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_categories`
--

DROP TABLE IF EXISTS `material_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_categories` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '分类名称',
  `description` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '分类描述',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_62b35039dee30044ba52c794efc` (`name`),
  KEY `IDX_MATERIAL_CATEGORIES_NAME` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_categories`
--

LOCK TABLES `material_categories` WRITE;
/*!40000 ALTER TABLE `material_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `material_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_tag_relations`
--

DROP TABLE IF EXISTS `material_tag_relations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_tag_relations` (
  `material_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`material_id`,`tag_id`),
  KEY `FK_94f26f3dd81d249844fcc47ffd3` (`tag_id`),
  CONSTRAINT `FK_94f26f3dd81d249844fcc47ffd3` FOREIGN KEY (`tag_id`) REFERENCES `material_tags` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_aa844cb93ee8c614343b52dde97` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_tag_relations`
--

LOCK TABLES `material_tag_relations` WRITE;
/*!40000 ALTER TABLE `material_tag_relations` DISABLE KEYS */;
/*!40000 ALTER TABLE `material_tag_relations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_tags`
--

DROP TABLE IF EXISTS `material_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_tags` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标签名称',
  `description` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '标签描述',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_66bbc96c5b129ec065fe9738d59` (`name`),
  KEY `IDX_MATERIAL_TAGS_NAME` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_tags`
--

LOCK TABLES `material_tags` WRITE;
/*!40000 ALTER TABLE `material_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `material_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filename` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '素材文件名',
  `original_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '素材原始文件名',
  `file_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '素材存储路径',
  `mime_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '素材MIME类型',
  `file_size` bigint DEFAULT NULL COMMENT '素材文件大小（字节）',
  `type` enum('image','audio','video','document','text','avatar','other') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'other' COMMENT '素材类型',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT '素材描述',
  `is_public` tinyint(1) NOT NULL DEFAULT '0' COMMENT '素材是否公开',
  `upload_dir` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '素材上传目录',
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '素材所属用户ID',
  `material_category_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '素材分类ID，关联到material_categories表',
  `metadata` json DEFAULT NULL COMMENT '素材元数据，存储额外信息',
  `parent_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '父素材ID，用于版本管理',
  `access_count` int NOT NULL DEFAULT '0' COMMENT '访问计数',
  `file_hash` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '文件哈希值，用于检测重复文件',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_fd1917860643281d11925241cc2` (`user_id`),
  KEY `FK_d7839ed100d657e871a15da0066` (`material_category_id`),
  KEY `IDX_MATERIALS_TYPE_USER` (`type`,`user_id`),
  KEY `IDX_MATERIALS_CREATED_AT` (`created_at`),
  KEY `IDX_MATERIALS_IS_PUBLIC` (`is_public`),
  CONSTRAINT `FK_d7839ed100d657e871a15da0066` FOREIGN KEY (`material_category_id`) REFERENCES `material_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_fd1917860643281d11925241cc2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
INSERT INTO `materials` VALUES ('1j5jGGz1R73FPrTo4sCJC','店铺轮播.jpeg','店铺轮播.jpeg','images/店铺轮播_1764483924761_fquqfhixg.jpeg','image/jpeg',1574338,'image',NULL,0,'images','QnRYOQvkR1zXmkeQ',NULL,NULL,NULL,0,'6c6eda98628a22d16fad90591d2c5c31727bb440b7437106237ddad36340a489','2025-11-30 06:25:25','2025-11-30 06:25:25',NULL),('3aS2N1NCwd_GZjZ1wuSEP','file-1764868573970','file-1764868573970','texts/file-1764868573970_1764868574119_lq0c37jg3','text/html',1069,'text',NULL,1,'texts','fb1h2gvxin16ejnt',NULL,NULL,NULL,0,'a9f31c51da177e6d3c24fdaf543de90804eb8a9ae3a2429d1534aa714c59e718','2025-12-04 17:16:14','2025-12-04 17:16:14',NULL),('6euhjlNcDBrXyE900T5UJ','八爪鱼商品图.jpeg','八爪鱼商品图.jpeg','images/八爪鱼商品图_1764433446430_99ct4w0ez.jpeg','image/jpeg',1685869,'image','spu main image',1,'images','QnRYOQvkR1zXmkeQ',NULL,NULL,NULL,0,'99ad49aa1df00731c66818875dbf45327840aea027305fc35867996d689a4db6','2025-11-29 16:24:06','2025-11-29 16:24:06',NULL),('84sTi7gEh0qKJPry7jX6L','首页3.jpeg','首页3.jpeg','images/首页3_1764445326686_uxl6wn1hc.jpeg','image/jpeg',1263469,'image',NULL,0,'images','QnRYOQvkR1zXmkeQ',NULL,NULL,NULL,0,'07c9142f339b23f2431a80466838abcd8ccbd23d70652441bae1fd65e69810a3','2025-11-29 19:42:06','2025-11-29 19:42:06',NULL),('DF4glVhTot3lXSmP64q0w','胖子炒粉.jpeg','胖子炒粉.jpeg','images/胖子炒粉_1764432925877_k1n0ajafc.jpeg','image/jpeg',950476,'image','brand logo',1,'images','QnRYOQvkR1zXmkeQ',NULL,NULL,NULL,0,'d51c4610491815d4677e2e1654f6e0c957f25addf86013dc28773ad70202b47e','2025-11-29 16:15:25','2025-11-29 16:15:25',NULL),('Ej-4u4hj5IMd2724yTjI3','首页2.jpeg','首页2.jpeg','images/首页2_1764445317042_af72cdn5t.jpeg','image/jpeg',1164992,'image',NULL,0,'images','QnRYOQvkR1zXmkeQ',NULL,NULL,NULL,0,'a5ecdc9771999081f2bb34934d52db3df7d755a83293deb0479a174718b51380','2025-11-29 19:41:57','2025-11-29 19:41:57',NULL),('hzFXl1ZD8d_7pARVfESJ5','海鲜商品图.jpeg','海鲜商品图.jpeg','images/海鲜商品图_1764432878768_01nc7i3oj.jpeg','image/jpeg',1775734,'image','category image',1,'images','QnRYOQvkR1zXmkeQ',NULL,NULL,NULL,0,'5d175c433d15acd25db81395832c7409adcf811b6c3b4eac5139d3ce35fa8630','2025-11-29 16:14:38','2025-11-29 16:14:38',NULL),('NZbKAjB-Fhf9SHJtNyWgf','首页1.jpeg','首页1.jpeg','images/首页1_1764445203488_79ikouo6e.jpeg','image/jpeg',1327708,'image',NULL,0,'images','QnRYOQvkR1zXmkeQ',NULL,NULL,NULL,0,'71a729ec9ab6886a3a099a479c27d3f63d3fb202389581eca6eb75023e4cd0a4','2025-11-29 19:40:03','2025-11-29 19:40:03',NULL),('qq8gDK1ps5qZhH2ULThXq','店铺轮播2.jpeg','店铺轮播2.jpeg','images/店铺轮播2_1764483931488_85rcssa9e.jpeg','image/jpeg',1654589,'image',NULL,0,'images','QnRYOQvkR1zXmkeQ',NULL,NULL,NULL,0,'072e17c9bfab2d42944d9e93c633beb0437a2a7cfbc1b817e72740160bd4b87e','2025-11-30 06:25:31','2025-11-30 06:25:31',NULL),('S_fiYS_QjbeyfLH7SJEN2','牛肉商品图.jpeg','牛肉商品图.jpeg','images/牛肉商品图_1764433470245_x7x6s01sh.jpeg','image/jpeg',1592359,'image','spu main image',1,'images','QnRYOQvkR1zXmkeQ',NULL,NULL,NULL,0,'054199ace272b2b17eeb4a20de0605e08267c2d1e511e7a1f09c29bad118f3ae','2025-11-29 16:24:30','2025-11-29 16:24:30',NULL),('UNTT3DqEoVgqwqBsBztU_','阿姨海鲜.jpeg','阿姨海鲜.jpeg','images/阿姨海鲜_1764432414833_2ttocbbgu.jpeg','image/jpeg',950462,'image','brand logo',1,'images','QnRYOQvkR1zXmkeQ',NULL,NULL,NULL,0,'4c86f293815c38d6978a65c8278e88e89fc736abbed4d22dbd08311f996e6da6','2025-11-29 16:06:54','2025-11-29 16:06:54',NULL),('vnsFihUo0-ovXQsU68dW2','file-1764868827498','file-1764868827498','images/file-1764868827498_1764868827539_gijjrkpj1','image/jpeg',3387706,'image',NULL,1,'images','fb1h2gvxin16ejnt',NULL,NULL,NULL,0,'ce033849a3600f33c0a3711a04976688a13f55bd8c789477291b0e3e8273e5c1','2025-12-04 17:20:27','2025-12-04 17:20:27',NULL);
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (2,1708669101000,'CreateUserSettings1708669101000'),(3,1708669200000,'CreatePermission1708669200000'),(4,1708669201000,'CreateRole1708669201000'),(5,1708669700000,'CreateMaterialTable1708669700000'),(6,1752669901001,'CreateMallOrdersTables1752669901001'),(7,1753669905000,'CreateProductBrandTables1753669905000'),(8,1753669906000,'CreateProductCategoryTables1753669906000'),(9,1753669907000,'CreateProductSpuTables1753669907000'),(10,1753669908000,'CreateProductSkuTables1753669908000'),(11,1753669909000,'CreateProductAttributeTables1753669909000'),(12,1754669901000,'CreateUserAddressTables1754669901000'),(13,1754669902000,'CreateCartTable1754669902000'),(16,1708669100000,'CreateUserTables1708669100000'),(17,1755669901000,'CreateHomeTables1755669901000');
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resource` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES ('_xsVNVQq6q5aeOFY','role:delete','role','delete','允许delete操作role资源','2025-11-29 16:06:06','2025-11-29 16:06:06',NULL),('3rzsMCbOJJjMQKF8','permission:delete','permission','delete','允许delete操作permission资源','2025-11-29 16:06:06','2025-11-29 16:06:06',NULL),('aB7KsX7IPPN-cw6A','role:read','role','read','允许read操作role资源','2025-11-29 16:06:06','2025-11-29 16:06:06',NULL),('DgMlpApWd6WRVaxr','permission:update','permission','update','允许update操作permission资源','2025-11-29 16:06:06','2025-11-29 16:06:06',NULL),('eCrwTZojLLbQjkZV','user:delete','user','delete','允许delete操作user资源','2025-11-29 16:06:06','2025-11-29 16:06:06',NULL),('FdYdfNeHIDfD-vXZ','role:create','role','create','允许create操作role资源','2025-11-29 16:06:06','2025-11-29 16:06:06',NULL),('FlRrDCGzv0QpXjU3','user:read','user','read','允许read操作user资源','2025-11-29 16:06:06','2025-11-29 16:06:06',NULL),('j2xyMuY_T6zCXn0Q','permission:create','permission','create','允许create操作permission资源','2025-11-29 16:06:06','2025-11-29 16:06:06',NULL),('jAwl8EQu3Cw77oiC','user:update','user','update','允许update操作user资源','2025-11-29 16:06:06','2025-11-29 16:06:06',NULL),('pnm8qKNBgghnnYiv','permission:read','permission','read','允许read操作permission资源','2025-11-29 16:06:06','2025-11-29 16:06:06',NULL),('PVRq97kc5Gp-GJZr','role:update','role','update','允许update操作role资源','2025-11-29 16:06:06','2025-11-29 16:06:06',NULL),('R41um8hzfXh7-oDF','user:create','user','create','允许create操作user资源','2025-11-29 16:06:06','2025-11-29 16:06:06',NULL);
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_attribute_keys`
--

DROP TABLE IF EXISTS `product_attribute_keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_attribute_keys` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `spu_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('TEXT','COLOR','IMAGE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TEXT',
  `required` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_7961a0a098ce3b26b429c725410` (`spu_id`),
  CONSTRAINT `FK_7961a0a098ce3b26b429c725410` FOREIGN KEY (`spu_id`) REFERENCES `product_spu` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_attribute_keys`
--

LOCK TABLES `product_attribute_keys` WRITE;
/*!40000 ALTER TABLE `product_attribute_keys` DISABLE KEYS */;
INSERT INTO `product_attribute_keys` VALUES ('5PfPHnMEkRsFJ_61','VOLQEbc3N5V6cAlL','辣','spicy','TEXT',0,'2025-11-29 17:16:40','2025-11-29 17:16:40',NULL),('MwJ97N3BeZLu3bL4','VOLQEbc3N5V6cAlL','种类','type','TEXT',0,'2025-12-09 16:33:01','2025-12-09 16:33:01',NULL);
/*!40000 ALTER TABLE `product_attribute_keys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_attribute_values`
--

DROP TABLE IF EXISTS `product_attribute_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_attribute_values` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attribute_key_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color_hex` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_2e80af8a8299e5f667be66d06d6` (`attribute_key_id`),
  KEY `FK_9fde871c0677e5d7b4ebd4b673c` (`image_id`),
  CONSTRAINT `FK_2e80af8a8299e5f667be66d06d6` FOREIGN KEY (`attribute_key_id`) REFERENCES `product_attribute_keys` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_9fde871c0677e5d7b4ebd4b673c` FOREIGN KEY (`image_id`) REFERENCES `materials` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_attribute_values`
--

LOCK TABLES `product_attribute_values` WRITE;
/*!40000 ALTER TABLE `product_attribute_values` DISABLE KEYS */;
INSERT INTO `product_attribute_values` VALUES ('1Xvz-jTzdaM3Zcka','MwJ97N3BeZLu3bL4','九爪','nine',NULL,NULL,'2025-12-09 16:33:24','2025-12-09 16:33:24',NULL),('bebzxzEQo_wzWu8N','5PfPHnMEkRsFJ_61','一般辣','little',NULL,NULL,'2025-12-09 16:17:55','2025-12-09 16:17:55',NULL),('FMeCxAnkQzZ225VP','5PfPHnMEkRsFJ_61','巨辣','very-spicy',NULL,NULL,'2025-11-29 17:21:16','2025-11-29 17:21:16',NULL),('Fp_xgbH0Lzp7uOb2','MwJ97N3BeZLu3bL4','八爪','eight',NULL,NULL,'2025-12-09 16:33:13','2025-12-09 16:33:13',NULL);
/*!40000 ALTER TABLE `product_attribute_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_brands`
--

DROP TABLE IF EXISTS `product_brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_brands` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `material_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('ENABLED','DISABLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ENABLED',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_product_brand_name` (`name`),
  KEY `FK_e43f94e6e1b6c75bd031c5b7ba8` (`material_id`),
  CONSTRAINT `FK_e43f94e6e1b6c75bd031c5b7ba8` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_brands`
--

LOCK TABLES `product_brands` WRITE;
/*!40000 ALTER TABLE `product_brands` DISABLE KEYS */;
INSERT INTO `product_brands` VALUES ('iJthoYk5hibVRp3X','阿姨海鲜','好吃','UNTT3DqEoVgqwqBsBztU_','','ENABLED','2025-11-29 16:09:53','2025-11-29 16:09:53',NULL);
/*!40000 ALTER TABLE `product_brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_categories`
--

DROP TABLE IF EXISTS `product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_categories` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level` int NOT NULL DEFAULT '0',
  `material_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brand_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('ENABLED','DISABLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ENABLED',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_5f151d414daab0290f65b517ed4` (`parent_id`),
  KEY `FK_273ba9ba0d7a3033f79d1e668cd` (`material_id`),
  KEY `FK_f7384ae8eef8dbede42daa1f52e` (`brand_id`),
  CONSTRAINT `FK_273ba9ba0d7a3033f79d1e668cd` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_5f151d414daab0290f65b517ed4` FOREIGN KEY (`parent_id`) REFERENCES `product_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_f7384ae8eef8dbede42daa1f52e` FOREIGN KEY (`brand_id`) REFERENCES `product_brands` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_categories`
--

LOCK TABLES `product_categories` WRITE;
/*!40000 ALTER TABLE `product_categories` DISABLE KEYS */;
INSERT INTO `product_categories` VALUES ('4ijo5fdV9jgwkoQW','海鲜','',NULL,0,'hzFXl1ZD8d_7pARVfESJ5','iJthoYk5hibVRp3X','ENABLED','2025-11-29 16:14:44','2025-11-29 16:14:44',NULL),('QZXJnZB8_7XiZwTr','牛肉','',NULL,0,NULL,'iJthoYk5hibVRp3X','ENABLED','2025-11-29 16:15:08','2025-11-29 16:15:16',NULL),('ZV8hIpgRV4eT6nnr','炒粉','',NULL,0,NULL,NULL,'ENABLED','2025-11-29 16:21:06','2025-11-29 16:21:06',NULL);
/*!40000 ALTER TABLE `product_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_sku`
--

DROP TABLE IF EXISTS `product_sku`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_sku` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `spu_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku_name` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `original_price` decimal(10,2) DEFAULT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `status` enum('ON_SHELF','OFF_SHELF') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ON_SHELF',
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_0155da70cb78cd714bbbc691a88` (`spu_id`),
  KEY `idx_product_sku_code` (`sku_code`),
  CONSTRAINT `FK_0155da70cb78cd714bbbc691a88` FOREIGN KEY (`spu_id`) REFERENCES `product_spu` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_sku`
--

LOCK TABLES `product_sku` WRITE;
/*!40000 ALTER TABLE `product_sku` DISABLE KEYS */;
INSERT INTO `product_sku` VALUES ('4Yu9_4_mKYoOt60e','VOLQEbc3N5V6cAlL','FMeCxAnkQzZ225VP-Fp_xgbH0Lzp7uOb2','FMeCxAnkQzZ225VP Fp_xgbH0Lzp7uOb2',100.00,NULL,NULL,2,'ON_SHELF',0,'2025-12-09 16:33:35','2025-12-09 16:33:35',NULL),('65bBaW7Yg5k9Ool-','VOLQEbc3N5V6cAlL','bebzxzEQo_wzWu8N-1Xvz-jTzdaM3Zcka','bebzxzEQo_wzWu8N 1Xvz-jTzdaM3Zcka',100.00,NULL,NULL,2,'ON_SHELF',0,'2025-12-09 16:33:35','2025-12-09 16:33:35',NULL),('gddXhnUAgHeL10Ty','VOLQEbc3N5V6cAlL','FMeCxAnkQzZ225VP-1Xvz-jTzdaM3Zcka','FMeCxAnkQzZ225VP 1Xvz-jTzdaM3Zcka',100.00,NULL,NULL,2,'ON_SHELF',0,'2025-12-09 16:33:35','2025-12-09 16:33:35',NULL),('UiPb4J2GhrAzkjS6','VOLQEbc3N5V6cAlL','bebzxzEQo_wzWu8N-Fp_xgbH0Lzp7uOb2','bebzxzEQo_wzWu8N Fp_xgbH0Lzp7uOb2',100.00,NULL,NULL,2,'ON_SHELF',0,'2025-12-09 16:33:35','2025-12-09 16:33:35',NULL),('wAM3h2ADglga3aP1','H5kbL0OUq3IJZTpu','default','默认规格',0.00,NULL,NULL,100,'ON_SHELF',1,'2025-11-29 17:00:48','2025-11-29 17:00:48',NULL);
/*!40000 ALTER TABLE `product_sku` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_sku_attributes`
--

DROP TABLE IF EXISTS `product_sku_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_sku_attributes` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attribute_key_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attribute_value_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_557f8a515721a9351eca16454b1` (`sku_id`),
  KEY `FK_7825051699b0ad7ce162cf97c92` (`attribute_key_id`),
  KEY `FK_7648523129754c551db029a2767` (`attribute_value_id`),
  CONSTRAINT `FK_557f8a515721a9351eca16454b1` FOREIGN KEY (`sku_id`) REFERENCES `product_sku` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_7648523129754c551db029a2767` FOREIGN KEY (`attribute_value_id`) REFERENCES `product_attribute_values` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_7825051699b0ad7ce162cf97c92` FOREIGN KEY (`attribute_key_id`) REFERENCES `product_attribute_keys` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_sku_attributes`
--

LOCK TABLES `product_sku_attributes` WRITE;
/*!40000 ALTER TABLE `product_sku_attributes` DISABLE KEYS */;
INSERT INTO `product_sku_attributes` VALUES ('2P0eCZGTJ7SIerlr','4Yu9_4_mKYoOt60e','MwJ97N3BeZLu3bL4','Fp_xgbH0Lzp7uOb2','2025-12-09 16:33:35','2025-12-09 16:33:35',NULL),('a85rwTXgQizsUBHJ','gddXhnUAgHeL10Ty','5PfPHnMEkRsFJ_61','FMeCxAnkQzZ225VP','2025-12-09 16:33:35','2025-12-09 16:33:35',NULL),('fiVegOUixYCV23Hx','65bBaW7Yg5k9Ool-','5PfPHnMEkRsFJ_61','bebzxzEQo_wzWu8N','2025-12-09 16:33:35','2025-12-09 16:33:35',NULL),('HRwtOVvpNcLZNXld','UiPb4J2GhrAzkjS6','MwJ97N3BeZLu3bL4','Fp_xgbH0Lzp7uOb2','2025-12-09 16:33:35','2025-12-09 16:33:35',NULL),('pQP75NZS2Ts6jdN_','UiPb4J2GhrAzkjS6','5PfPHnMEkRsFJ_61','bebzxzEQo_wzWu8N','2025-12-09 16:33:35','2025-12-09 16:33:35',NULL),('QlYCwrF3ygesC9iQ','4Yu9_4_mKYoOt60e','5PfPHnMEkRsFJ_61','FMeCxAnkQzZ225VP','2025-12-09 16:33:35','2025-12-09 16:33:35',NULL),('QNDCHbKIyYrkqluo','65bBaW7Yg5k9Ool-','MwJ97N3BeZLu3bL4','1Xvz-jTzdaM3Zcka','2025-12-09 16:33:35','2025-12-09 16:33:35',NULL),('RVBlptDOt8V3Blo9','gddXhnUAgHeL10Ty','MwJ97N3BeZLu3bL4','1Xvz-jTzdaM3Zcka','2025-12-09 16:33:35','2025-12-09 16:33:35',NULL);
/*!40000 ALTER TABLE `product_sku_attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_spu`
--

DROP TABLE IF EXISTS `product_spu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_spu` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sub_title` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brand_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('DRAFT','ON_SHELF','OFF_SHELF') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `main_material` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detail_content` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_b401e458471c73bc19d7dfbca71` (`category_id`),
  KEY `FK_98b82715e97147d62f94714ab4a` (`brand_id`),
  KEY `FK_3037f98429fd99d22972d451847` (`main_material`),
  CONSTRAINT `FK_3037f98429fd99d22972d451847` FOREIGN KEY (`main_material`) REFERENCES `materials` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_98b82715e97147d62f94714ab4a` FOREIGN KEY (`brand_id`) REFERENCES `product_brands` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_b401e458471c73bc19d7dfbca71` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_spu`
--

LOCK TABLES `product_spu` WRITE;
/*!40000 ALTER TABLE `product_spu` DISABLE KEYS */;
INSERT INTO `product_spu` VALUES ('68a9Ad9vzwpEQTOa','海鲜拼盘','分类很大的海鲜拼盘','','4ijo5fdV9jgwkoQW','iJthoYk5hibVRp3X','ON_SHELF','hzFXl1ZD8d_7pARVfESJ5','','2025-11-29 16:22:53','2025-11-30 11:43:15',NULL),('H5kbL0OUq3IJZTpu','牛排','新鲜的好吃的牛排','','QZXJnZB8_7XiZwTr','iJthoYk5hibVRp3X','ON_SHELF','S_fiYS_QjbeyfLH7SJEN2','','2025-11-29 16:24:43','2025-11-30 11:42:57',NULL),('VOLQEbc3N5V6cAlL','八爪鱼','好好吃的八爪鱼','','4ijo5fdV9jgwkoQW','iJthoYk5hibVRp3X','ON_SHELF','6euhjlNcDBrXyE900T5UJ','','2025-11-29 16:24:15','2025-11-30 11:43:04',NULL);
/*!40000 ALTER TABLE `product_spu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_spu_sub_materials`
--

DROP TABLE IF EXISTS `product_spu_sub_materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_spu_sub_materials` (
  `spu_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `material_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`spu_id`,`material_id`),
  KEY `FK_ded5390ce816eb35302ac996a3b` (`material_id`),
  CONSTRAINT `FK_3018be506a7bc42096fc59691a9` FOREIGN KEY (`spu_id`) REFERENCES `product_spu` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_ded5390ce816eb35302ac996a3b` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_spu_sub_materials`
--

LOCK TABLES `product_spu_sub_materials` WRITE;
/*!40000 ALTER TABLE `product_spu_sub_materials` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_spu_sub_materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `role_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `permission_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES ('4f5b704c-cd3d-11f0-b790-52487367ab24','_xsVNVQq6q5aeOFY'),('4f5b704c-cd3d-11f0-b790-52487367ab24','3rzsMCbOJJjMQKF8'),('4f5b704c-cd3d-11f0-b790-52487367ab24','aB7KsX7IPPN-cw6A'),('4f5b704c-cd3d-11f0-b790-52487367ab24','DgMlpApWd6WRVaxr'),('4f5b704c-cd3d-11f0-b790-52487367ab24','eCrwTZojLLbQjkZV'),('4f5b704c-cd3d-11f0-b790-52487367ab24','FdYdfNeHIDfD-vXZ'),('4f5b704c-cd3d-11f0-b790-52487367ab24','FlRrDCGzv0QpXjU3'),('4f5b704c-cd3d-11f0-b790-52487367ab24','j2xyMuY_T6zCXn0Q'),('4f5b704c-cd3d-11f0-b790-52487367ab24','jAwl8EQu3Cw77oiC'),('4f5b704c-cd3d-11f0-b790-52487367ab24','pnm8qKNBgghnnYiv'),('4f5b704c-cd3d-11f0-b790-52487367ab24','PVRq97kc5Gp-GJZr'),('4f5b704c-cd3d-11f0-b790-52487367ab24','R41um8hzfXh7-oDF');
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES ('4f5b704c-cd3d-11f0-b790-52487367ab24','super_admin','超级管理员','2025-11-29 16:06:05','2025-11-29 16:06:05',NULL),('4f5b8596-cd3d-11f0-b790-52487367ab24','admin','管理员','2025-11-29 16:06:05','2025-11-29 16:06:05',NULL),('4f5b86fe-cd3d-11f0-b790-52487367ab24','moderator','版主','2025-11-29 16:06:05','2025-11-29 16:06:05',NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_intro_banners`
--

DROP TABLE IF EXISTS `shop_intro_banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_intro_banners` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shop_intro_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `material_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_294c41fa1d0f35e7e1e9e1d50a7` (`shop_intro_id`),
  KEY `FK_c2967d31416d6cb70651d426591` (`material_id`),
  CONSTRAINT `FK_294c41fa1d0f35e7e1e9e1d50a7` FOREIGN KEY (`shop_intro_id`) REFERENCES `shop_intros` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_c2967d31416d6cb70651d426591` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_intro_banners`
--

LOCK TABLES `shop_intro_banners` WRITE;
/*!40000 ALTER TABLE `shop_intro_banners` DISABLE KEYS */;
INSERT INTO `shop_intro_banners` VALUES ('0jf6ykpr6561kn3z','aro5f5wee8hebe81','1j5jGGz1R73FPrTo4sCJC',0,'2025-11-30 06:33:27','2025-11-30 06:33:27',NULL),('c1o74d617o1snq3p','aro5f5wee8hebe81','qq8gDK1ps5qZhH2ULThXq',1,'2025-11-30 06:33:27','2025-11-30 06:33:27',NULL);
/*!40000 ALTER TABLE `shop_intro_banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_intros`
--

DROP TABLE IF EXISTS `shop_intros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_intros` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '店铺名称',
  `introduction` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '店铺简介',
  `detail` text COLLATE utf8mb4_unicode_ci COMMENT '店铺详情',
  `contact_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '联系电话',
  `longitude` decimal(10,6) DEFAULT NULL COMMENT '经度',
  `latitude` decimal(10,6) DEFAULT NULL COMMENT '纬度',
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '详细地址',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_intros`
--

LOCK TABLES `shop_intros` WRITE;
/*!40000 ALTER TABLE `shop_intros` DISABLE KEYS */;
INSERT INTO `shop_intros` VALUES ('aro5f5wee8hebe81','普通店铺','吃好喝好','这是我的一家店铺','13000000001',114.219634,30.772048,'机场大道','2025-11-30 06:25:49','2025-11-30 06:33:27',NULL);
/*!40000 ALTER TABLE `shop_intros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_addresses`
--

DROP TABLE IF EXISTS `user_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_addresses` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `province` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `town` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detail` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postal_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `tag` enum('HOME','COMPANY','SCHOOL','OTHER') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_addresses_user` (`user_id`),
  CONSTRAINT `FK_7a5100ce0548ef27a6f1533a5ce` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_addresses`
--

LOCK TABLES `user_addresses` WRITE;
/*!40000 ALTER TABLE `user_addresses` DISABLE KEYS */;
INSERT INTO `user_addresses` VALUES ('wOjXg_jQB2odVRUc','fb1h2gvxin16ejnt','kim','13000000000','北京市','市辖区','西城区','新街口街道','11','',0,NULL,'ACTIVE','2025-11-29 17:04:56','2025-11-29 17:04:56',NULL);
/*!40000 ALTER TABLE `user_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES ('QnRYOQvkR1zXmkeQ','4f5b704c-cd3d-11f0-b790-52487367ab24');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_settings`
--

DROP TABLE IF EXISTS `user_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_settings` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `theme` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'light',
  `language` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'zh-CN',
  `notifications_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_4ed056b9344e6f7d8d46ec4b302` (`user_id`),
  CONSTRAINT `FK_4ed056b9344e6f7d8d46ec4b302` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_settings`
--

LOCK TABLES `user_settings` WRITE;
/*!40000 ALTER TABLE `user_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('male','female','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthdate` date DEFAULT NULL,
  `status` enum('active','inactive','banned') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_fe0bb3f6520ee0469504521e710` (`username`),
  UNIQUE KEY `UQ_a000cca60bcf04454e727699490` (`phone`),
  UNIQUE KEY `UQ_97672ac88f789774dd47f7c8be3` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('fb1h2gvxin16ejnt','kk',NULL,'$2b$10$Hd93fAd3ablrR4hmUqHvkeEyQmm6.84aZFZ6FNlhRsPUXtx81kI2O','金','13247650000','images/file-1764868827498_1764868827539_gijjrkpj1','卧室胖子','female','2000-12-05','active',1,NULL,'2025-11-29 16:06:42','2025-12-04 17:59:21',NULL),('j0mhtf7g52zmndnz','kk3',NULL,'$2b$10$l7GdfVyYIF17I95tHN.kROl1BQqOJ7MFVN4CaylPx1eIQ/McnS0Eq','kk2','13044444444',NULL,NULL,'male',NULL,'active',1,NULL,'2025-12-05 12:32:29','2025-12-05 12:32:29',NULL),('QnRYOQvkR1zXmkeQ','super_admin','super_admin@example.com','$2b$10$b8IXybFJWQ629a0E2Un3FetBCJAwjhC1b2aILma4EBBykOiXYxd3u','超级管理员','13800000000',NULL,NULL,'male',NULL,'active',1,NULL,'2025-11-29 16:06:06','2025-11-29 16:06:06',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-10  1:04:47
