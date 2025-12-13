import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '@/configs/database.config';
import { User } from '@/modules/user/user.model';
import { logDebug, logError } from '@/utils/logger';
import { ENV } from '@/configs/env.config';

interface JwtPayload {
    id: string;
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: '未提供认证令牌' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const secret: string = ENV.JWT_SECRET;
        const decoded = jwt.verify(token, secret) as JwtPayload;
        const userRepository = AppDataSource.getRepository(User);
        
        const user = await userRepository.findOne({
            where: { id: decoded.id },
            relations: ['roles', 'roles.permissions']
        });

        if (!user) {
            logError('Auth 中间件 - 用户不存在');
            res.status(401).json({ message: '用户不存在' });
            return;
        }

        // 将用户信息添加到请求对象
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: '认证失败' });
        return;
    }
}

/**
 * 确保用户只能访问自己的资源
 * 验证 req.user.id 是否与 req.params.id 匹配
 * 必须在 authMiddleware 之后使用
 */
export function ensureSelf(req: Request, res: Response, next: NextFunction): void {
    if (!req.user || req.user.id !== req.params.id) {
        res.status(403).json({ code: 403, message: '禁止访问' });
        return;
    }
    next();
} 