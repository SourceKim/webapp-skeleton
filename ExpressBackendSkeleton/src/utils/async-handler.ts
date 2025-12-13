import { Request, Response, NextFunction } from 'express';

/**
 * 异步处理器包装函数
 * 自动捕获异步函数中的错误并传递给 Express 错误处理中间件
 * 
 * @example
 * // 使用前
 * public createRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
 *     try {
 *         const roleData = validateData(createRoleSchema, req.body);
 *         const role = await this.roleService.createRole(roleData);
 *         res.status(200).json({
 *             code: 0,
 *             message: '角色创建成功',
 *             data: role
 *         });
 *     } catch (error) {
 *         next(error);
 *     }
 * }
 * 
 * // 使用后（推荐方式，需要先注册 responseMiddleware）
 * public createRole = asyncHandler(async (req: Request, res: Response): Promise<void> => {
 *     const roleData = validateData(createRoleSchema, req.body);
 *     const role = await this.roleService.createRole(roleData);
 *     res.success(role, '角色创建成功');
 * });
 * 
 * // 或者使用工具函数方式（不需要中间件）
 * import { sendSuccess } from '@/utils/response.util';
 * 
 * public createRole = asyncHandler(async (req: Request, res: Response): Promise<void> => {
 *     const roleData = validateData(createRoleSchema, req.body);
 *     const role = await this.roleService.createRole(roleData);
 *     sendSuccess(res, role, '角色创建成功');
 * });
 * 
 * @param fn 异步处理函数
 * @returns Express 路由处理器
 */
export function asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
