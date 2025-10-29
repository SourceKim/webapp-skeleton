import { Request, Response, NextFunction } from 'express';
import { ApiResponse, FindByIdDto, PaginatedResponse } from '@/modules/common/common.dto';
import { ProductSpuDTO, CreateProductSpuDto, UpdateProductSpuDto, UpdateProductSpuStatusDto } from './product-spu.dto';
import { ProductSpuService } from './product-spu.service';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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
            const { id } = await req.validate(FindByIdDto, 'params');
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
            const { id } = await req.validate(FindByIdDto, 'params');
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
            const body = await req.validate(CreateProductSpuDto, 'body');
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
            const { id } = await req.validate(FindByIdDto, 'params');
            // 兼容旧参数：sub_materials -> sub_material_ids
            if (req.body && req.body.sub_materials && !req.body.sub_material_ids) {
                req.body.sub_material_ids = req.body.sub_materials;
                delete req.body.sub_materials;
            }
            const body = await req.validate(UpdateProductSpuDto, 'body');
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
            const { id } = await req.validate(FindByIdDto, 'params');
            await this.service.remove(id);
            res.json({ code: 0, message: '删除成功' });
        } catch (error) {
            next(error);
        }
    };
}


