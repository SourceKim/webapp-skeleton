import { Request, Response, NextFunction } from 'express';
import { ApiResponse, PaginatedResponse } from '@/modules/common/common.dto';
import { paginationQuery } from '@/middlewares/paginationQuery';
import { paginationResponse } from '@/middlewares/paginationResponse';
import { ProductBrandDTO } from './product-brand.dto';
import { ProductBrandService } from './product-brand.service';
import { createProductBrandSchema, updateProductBrandSchema } from '@skeleton/shared-types';
import { idParamSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';

export class ProductBrandController {
    private service = new ProductBrandService();

    public list = async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<ProductBrandDTO>>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { items, total } = await this.service.findAllBrands(req.pagination);
            return res.pagination(items, total);
        } catch (error) {
            next(error);
        }
    };

    public detail = async (
        req: Request,
        res: Response<ApiResponse<ProductBrandDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            const data = await this.service.findBrandById(id);
            res.json({ code: 0, message: 'success', data });
        } catch (error) {
            next(error);
        }
    };

    public create = async (
        req: Request,
        res: Response<ApiResponse<ProductBrandDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const body = validateData(createProductBrandSchema, req.body);
            const data = await this.service.createBrand(body);
            res.status(200).json({ code: 0, message: '创建成功', data });
        } catch (error) {
            next(error);
        }
    };

    public update = async (
        req: Request,
        res: Response<ApiResponse<ProductBrandDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            const body = validateData(updateProductBrandSchema, req.body);
            const data = await this.service.updateBrand(id, body);
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
            await this.service.deleteBrand(id);
            res.json({ code: 0, message: '删除成功' });
        } catch (error) {
            next(error);
        }
    };
}


