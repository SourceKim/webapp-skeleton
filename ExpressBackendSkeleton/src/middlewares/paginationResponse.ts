import { Request, Response, NextFunction } from 'express';
import { PaginatedResponse, ApiResponse } from '@/modules/common/common.dto';

export const paginationResponse = (req: Request, res: Response, next: NextFunction) => {
        res.pagination = function<T>(data: T[], total: number) {
            const paginationReq = req.pagination;
            const totalPages = Math.ceil(total / paginationReq.limit);
            const response: ApiResponse<PaginatedResponse<T>> = {
            code: 0,
            message: 'success',
            data: {
                items: data,
                meta: {
                    total: total,
                    page: paginationReq.page,
                    limit: paginationReq.limit,
                    sort_by: paginationReq.sort_by,
                    sort_order: paginationReq.sort_order,
                    pages: totalPages
                }
            }
        };
        res.json(response);
    };
    next();
}