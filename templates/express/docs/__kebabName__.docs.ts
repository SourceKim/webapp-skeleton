/* eslint-disable */
/**
 * @swagger
 * components:
 *   schemas:
 *     __PascalName__Dto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID
 *         name:
 *           type: string
 *           description: 名称
 *         description:
 *           type: string
 *           description: 描述
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 * paths:
 *   /__kebabNamePlural__/admin:
 *     get:
 *       tags:
 *         - __PascalName__
 *       summary: 分页获取 __PascalName__ 列表
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         200:
 *           description: 成功
 *     post:
 *       tags:
 *         - __PascalName__
 *       summary: 创建 __PascalName__
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       responses:
 *         200:
 *           description: 创建成功
 *
 *   /__kebabNamePlural__/admin/{id}:
 *     get:
 *       tags:
 *         - __PascalName__
 *       summary: 获取 __PascalName__ 详情
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *       responses:
 *         200:
 *           description: 成功
 *     put:
 *       tags:
 *         - __PascalName__
 *       summary: 更新 __PascalName__
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       responses:
 *         200:
 *           description: 成功
 *     delete:
 *       tags:
 *         - __PascalName__
 *       summary: 删除 __PascalName__
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *       responses:
 *         200:
 *           description: 成功
 */


