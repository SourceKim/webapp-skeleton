/**
 * @openapi
 * tags:
 *   - name: ProductCategory
 *     description: 商品分类管理
 */

/**
 * @openapi
 * /products/categories:
 *   get:
 *     summary: 分类列表（支持 parent_id/level）
 *     tags: [ProductCategory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: parent_id
 *         schema: { type: string, nullable: true }
 *       - in: query
 *         name: level
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /products/categories/{id}:
 *   get:
 *     summary: 分类详情
 *     tags: [ProductCategory]
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
 * /products/categories/admin:
 *   post:
 *     summary: 创建分类
 *     tags: [ProductCategory]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 成功
 */

/**
 * @openapi
 * /products/categories/admin/{id}:
 *   put:
 *     summary: 更新分类
 *     tags: [ProductCategory]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 成功
 *   delete:
 *     summary: 删除分类
 *     tags: [ProductCategory]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 成功
 */


