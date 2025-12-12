import { Request, Response, NextFunction } from 'express';
import { ApiResponse, PaginatedResponse } from '@/modules/common/common.dto';
import { ProductSpuDTO } from './product-spu.dto';
import { ProductSpuService } from './product-spu.service';
import { createProductSpuSchema, updateProductSpuSchema } from '@skeleton/shared-types';
import { idParamSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';

export class ProductSpuController {
    private service = new ProductSpuService();

    public list = async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<ProductSpuDTO>>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { items, total } = await this.service.findAll(req.pagination);
            return res.pagination(items, total);
        } catch (error) {
            next(error);
        }
    };

    // 生成 SKU（简化版：直接依据提交的 items 创建）
    public generateSkus = async (
        req: Request,
        res: Response<ApiResponse<{ count: number }>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            const body = req.body as { items: Array<{ sku_code?: string; sku_name?: string; price?: string; stock?: number; status?: string; is_default?: boolean; attribute_value_ids?: string[] }> };
            const count = await this.service.generateSkus(id, body.items || []);
            res.status(200).json({ code: 0, message: '生成成功', data: { count } });
        } catch (error) {
            next(error);
        }
    };

    public detail = async (
        req: Request,
        res: Response<ApiResponse<ProductSpuDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            const data = await this.service.findById(id);
            res.json({ code: 0, message: 'success', data });
        } catch (error) {
            next(error);
        }
    };

    public create = async (
        req: Request,
        res: Response<ApiResponse<ProductSpuDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            // 兼容旧参数：sub_materials -> sub_material_ids
            if (req.body && req.body.sub_materials && !req.body.sub_material_ids) {
                req.body.sub_material_ids = req.body.sub_materials;
                delete req.body.sub_materials;
            }
            const body = validateData(createProductSpuSchema, req.body);
            const data = await this.service.create(body);
            res.status(200).json({ code: 0, message: '创建成功', data });
        } catch (error) {
            next(error);
        }
    };

    public update = async (
        req: Request,
        res: Response<ApiResponse<ProductSpuDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            // 兼容旧参数：sub_materials -> sub_material_ids
            if (req.body && req.body.sub_materials && !req.body.sub_material_ids) {
                req.body.sub_material_ids = req.body.sub_materials;
                delete req.body.sub_materials;
            }
            const body = validateData(updateProductSpuSchema, req.body);
            const data = await this.service.update(id, body);
            res.json({ code: 0, message: '更新成功', data });
        } catch (error) {
            next(error);
        }
    };

    public remove = async (
        req: Request,
        res: Response<ApiResponse<void>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            await this.service.remove(id);
            res.json({ code: 0, message: '删除成功' });
        } catch (error) {
            next(error);
        }
    };
}


