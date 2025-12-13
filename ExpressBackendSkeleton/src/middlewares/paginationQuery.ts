import { Request, Response, NextFunction } from 'express';
import type { PaginationQueryDto } from '@skeleton/shared-types';
import { QueryFilterBuilder } from '@/utils/query-filter.util';



export const paginationQuery = () => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = Math.min(parseInt(req.query.limit as string) || 10, 100); // 限制最大每页条数为100
        const sort_by = req.query.sort_by as string || 'created_at';
        const sort_order = (req.query.sort_order as 'ASC' | 'DESC') || 'DESC';

        // 获取筛选参数 - Express 已自动解析嵌套对象
        const rawFilters = req.query.filters;
        const filters = (typeof rawFilters === 'object' && rawFilters !== null && !Array.isArray(rawFilters)) 
            ? rawFilters as Record<string, any> 
            : {};
        
        // 清理筛选参数，移除空值
        const cleanedFilters = QueryFilterBuilder.cleanFilters(filters);

        req.pagination = {
            page,
            limit,
            sort_by,
            sort_order,
            filters: Object.keys(cleanedFilters).length > 0 ? cleanedFilters : undefined
        };
        next();
    }
}