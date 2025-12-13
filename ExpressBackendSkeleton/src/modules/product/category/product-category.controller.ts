import { Request, Response } from 'express';
import type { ApiResponse, PaginatedResponse } from '@skeleton/shared-types';
import type { ProductCategoryResponseDto } from '@skeleton/shared-types';
import { ProductCategoryService } from './product-category.service';
import { createProductCategorySchema, updateProductCategorySchema } from '@skeleton/shared-types';
import { idParamSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';
import { asyncHandler } from '@/utils/async-handler';

export class ProductCategoryController {
    private service = new ProductCategoryService();

    public list = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<ProductCategoryResponseDto>>>
    ): Promise<void> => {
        const parentIdParam = (req.query.parent_id as string | undefined);
        const parentId: string | null | undefined = parentIdParam === undefined ? undefined : (parentIdParam === 'null' ? null : parentIdParam);
        const level = req.query.level ? parseInt(req.query.level as string) : undefined;
        const { items, total } = await this.service.findAll(req.pagination, parentId, level);
        return res.pagination(items, total);
    });

    public detail = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<ProductCategoryResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const data = await this.service.findById(id);
        res.json({ code: 0, message: 'success', data });
    });

    public create = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<ProductCategoryResponseDto>>
    ): Promise<void> => {
        const body = validateData(createProductCategorySchema, req.body);
        const data = await this.service.create(body);
        res.status(200).json({ code: 0, message: '创建成功', data });
    });

    public update = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<ProductCategoryResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const body = validateData(updateProductCategorySchema, req.body);
        const data = await this.service.update(id, body);
        res.json({ code: 0, message: '更新成功', data });
    });

    public remove = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<void>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        await this.service.remove(id);
        res.json({ code: 0, message: '删除成功' });
    });
}


