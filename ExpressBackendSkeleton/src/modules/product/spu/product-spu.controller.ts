import { Request, Response } from 'express';
import type { ApiResponse, PaginatedResponse } from '@skeleton/shared-types';
import type { ProductSpuResponseDto } from '@skeleton/shared-types';
import { ProductSpuService } from './product-spu.service';
import { createProductSpuSchema, updateProductSpuSchema } from '@skeleton/shared-types';
import { idParamSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';
import { asyncHandler } from '@/utils/async-handler';

export class ProductSpuController {
    private service = new ProductSpuService();

    public list = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<ProductSpuResponseDto>>>
    ): Promise<void> => {
        const { items, total } = await this.service.findAll(req.pagination);
        return res.pagination(items, total);
    });

    // 生成 SKU（简化版：直接依据提交的 items 创建）
    public generateSkus = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<{ count: number }>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const body = req.body as { items: Array<{ sku_code?: string; sku_name?: string; price?: string; stock?: number; status?: string; is_default?: boolean; attribute_value_ids?: string[] }> };
        const count = await this.service.generateSkus(id, body.items || []);
        res.status(200).json({ code: 0, message: '生成成功', data: { count } });
    });

    public detail = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<ProductSpuResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const data = await this.service.findById(id);
        res.json({ code: 0, message: 'success', data });
    });

    public create = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<ProductSpuResponseDto>>
    ): Promise<void> => {
        // 兼容旧参数：sub_materials -> sub_material_ids
        if (req.body && req.body.sub_materials && !req.body.sub_material_ids) {
            req.body.sub_material_ids = req.body.sub_materials;
            delete req.body.sub_materials;
        }
        const body = validateData(createProductSpuSchema, req.body);
        const data = await this.service.create(body);
        res.status(200).json({ code: 0, message: '创建成功', data });
    });

    public update = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<ProductSpuResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        // 兼容旧参数：sub_materials -> sub_material_ids
        if (req.body && req.body.sub_materials && !req.body.sub_material_ids) {
            req.body.sub_material_ids = req.body.sub_materials;
            delete req.body.sub_materials;
        }
        const body = validateData(updateProductSpuSchema, req.body);
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


