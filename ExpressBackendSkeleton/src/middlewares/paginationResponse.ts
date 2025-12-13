import { Request, Response, NextFunction } from 'express';
import type { PaginatedResponse, ApiResponse } from '@skeleton/shared-types';
import { ApiResponseCode } from '@skeleton/shared-types';

export const paginationResponse = (req: Request, res: Response, next: NextFunction) => {
        res.pagination = function<T>(data: T[], total: number) {
            const paginationReq = req.pagination;
            const totalPages = Math.ceil(total / paginationReq.limit);
            const response: ApiResponse<PaginatedResponse<T>> = {
            code: ApiResponseCode.SUCCESS,
            message: 'success',
            data: {
                items: data,
                total: total,
                page: paginationReq.page,
                limit: paginationReq.limit,
                pages: totalPages,
                sort_by: paginationReq.sort_by,
                sort_order: paginationReq.sort_order
            }
        };
        res.json(response);
    };
    next();
}