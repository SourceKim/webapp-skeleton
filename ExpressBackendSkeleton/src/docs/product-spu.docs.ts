/**
 * @openapi
 * tags:
 *   - name: ProductSpu
 *     description: 商品 SPU 管理
 */

/**
 * @openapi
 * /products/spu:
 *   get:
 *     summary: SPU 列表（分页）
 *     tags: [ProductSpu]
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
 * /products/spu/{id}:
 *   get:
 *     summary: SPU 详情
 *     tags: [ProductSpu]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /products/spu/admin:
 *   post:
 *     summary: 创建 SPU
 *     tags: [ProductSpu]
 *     security:
 *       - BearerAuth: []
 */

/**
 * @openapi
 * /products/spu/admin/{id}:
 *   put:
 *     summary: 更新 SPU
 *     tags: [ProductSpu]
 *     security:
 *       - BearerAuth: []
 *   delete:
 *     summary: 删除 SPU
 *     tags: [ProductSpu]
 *     security:
 *       - BearerAuth: []
 */


