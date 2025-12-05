/**
 * @openapi
 * tags:
 *   - name: ProductBrand
 *     description: 商品品牌管理
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     ProductBrand:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         material_id:
 *           type: string
 *           nullable: true
 *         website:
 *           type: string
 *         status:
 *           type: string
 *           enum: [ENABLED, DISABLED]
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */

/**
 * @openapi
 * /products/brands:
 *   get:
 *     summary: 品牌列表（分页）
 *     tags: [ProductBrand]
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
 * /products/brands/{id}:
 *   get:
 *     summary: 品牌详情
 *     tags: [ProductBrand]
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
 * /products/brands/admin:
 *   post:
 *     summary: 创建品牌
 *     tags: [ProductBrand]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /products/brands/admin/{id}:
 *   put:
 *     summary: 更新品牌
 *     tags: [ProductBrand]
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
 *   delete:
 *     summary: 删除品牌
 *     tags: [ProductBrand]
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


