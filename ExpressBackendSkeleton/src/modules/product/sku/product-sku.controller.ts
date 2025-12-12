import { Request, Response, NextFunction } from 'express';
import { ApiResponse, PaginatedResponse } from '@/modules/common/common.dto';
import { ProductSkuDTO } from './product-sku.dto';
import { ProductSkuService } from './product-sku.service';
import { createProductSkuSchema, updateProductSkuSchema } from '@skeleton/shared-types';
import { idParamSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';

export class ProductSkuController {
    private service = new ProductSkuService();

    public list = async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<ProductSkuDTO>>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { items, total } = await this.service.findAll(req.pagination);
            return res.pagination(items, total);
        } catch (error) {
            next(error);
        }
    };

    public detail = async (
        req: Request,
        res: Response<ApiResponse<ProductSkuDTO>>,
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
        res: Response<ApiResponse<ProductSkuDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const body = validateData(createProductSkuSchema, req.body);
            const data = await this.service.create(body);
            res.status(200).json({ code: 0, message: '创建成功', data });
        } catch (error) {
            next(error);
        }
    };

    public update = async (
        req: Request,
        res: Response<ApiResponse<ProductSkuDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            const body = validateData(updateProductSkuSchema, req.body);
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


