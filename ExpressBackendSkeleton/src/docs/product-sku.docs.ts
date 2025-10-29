/**
 * @openapi
 * tags:
 *   - name: ProductSku
 *     description: 商品 SKU 管理
 */

/**
 * @openapi
 * /products/sku:
 *   get:
 *     summary: SKU 列表（分页）
 *     tags: [ProductSku]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /products/sku/{id}:
 *   get:
 *     summary: SKU 详情
 *     tags: [ProductSku]
 *     security:
 *       - BearerAuth: []
 */

/**
 * @openapi
 * /products/sku/admin:
 *   post:
 *     summary: 创建 SKU
 *     tags: [ProductSku]
 *     security:
 *       - BearerAuth: []
 */

/**
 * @openapi
 * /products/sku/admin/{id}:
 *   put:
 *     summary: 更新 SKU
 *     tags: [ProductSku]
 *     security:
 *       - BearerAuth: []
 *   delete:
 *     summary: 删除 SKU
 *     tags: [ProductSku]
 *     security:
 *       - BearerAuth: []
 */


