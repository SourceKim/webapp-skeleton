import { Request, Response } from 'express';
import type { ApiResponse, PaginatedResponse } from '@skeleton/shared-types';
import type { ProductBrandResponseDto } from '@skeleton/shared-types';
import { ProductBrandService } from './product-brand.service';
import { createProductBrandSchema, updateProductBrandSchema } from '@skeleton/shared-types';
import { idParamSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';
import { asyncHandler } from '@/utils/async-handler';

export class ProductBrandController {
    private service = new ProductBrandService();

    public list = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<ProductBrandResponseDto>>>
    ): Promise<void> => {
        const { items, total } = await this.service.findAllBrands(req.pagination);
        return res.pagination(items, total);
    });

    public detail = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<ProductBrandResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const data = await this.service.findBrandById(id);
        res.json({ code: 0, message: 'success', data });
    });

    public create = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<ProductBrandResponseDto>>
    ): Promise<void> => {
        const body = validateData(createProductBrandSchema, req.body);
        const data = await this.service.createBrand(body);
        res.status(200).json({ code: 0, message: '创建成功', data });
    });

    public update = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<ProductBrandResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const body = validateData(updateProductBrandSchema, req.body);
        const data = await this.service.updateBrand(id, body);
        res.json({ code: 0, message: '更新成功', data });
    });

    public remove = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<void>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        await this.service.deleteBrand(id);
        res.json({ code: 0, message: '删除成功' });
    });
}


