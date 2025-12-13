import { Request, Response } from 'express';
import type { ApiResponse, PaginatedResponse } from '@skeleton/shared-types';
import type { ProductSkuResponseDto } from '@skeleton/shared-types';
import { ProductSkuService } from './product-sku.service';
import { createProductSkuSchema, updateProductSkuSchema } from '@skeleton/shared-types';
import { idParamSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';
import { asyncHandler } from '@/utils/async-handler';

export class ProductSkuController {
    private service = new ProductSkuService();

    public list = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<ProductSkuResponseDto>>>
    ): Promise<void> => {
        const { items, total } = await this.service.findAll(req.pagination);
        return res.pagination(items, total);
    });

    public detail = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<ProductSkuResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const data = await this.service.findById(id);
        res.json({ code: 0, message: 'success', data });
    });

    public create = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<ProductSkuResponseDto>>
    ): Promise<void> => {
        const body = validateData(createProductSkuSchema, req.body);
        const data = await this.service.create(body);
        res.status(200).json({ code: 0, message: '创建成功', data });
    });

    public update = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<ProductSkuResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const body = validateData(updateProductSkuSchema, req.body);
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


