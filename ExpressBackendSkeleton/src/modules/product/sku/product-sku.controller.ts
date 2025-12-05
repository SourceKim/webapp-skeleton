import { Request, Response, NextFunction } from 'express';
import { ApiResponse, FindByIdDto, PaginatedResponse } from '@/modules/common/common.dto';
import { ProductSkuDTO, CreateProductSkuDto, UpdateProductSkuDto, UpdateSkuPriceDto, UpdateSkuStatusDto, UpdateSkuStockDto } from './product-sku.dto';
import { ProductSkuService } from './product-sku.service';

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
            const { id } = await req.validate(FindByIdDto, 'params');
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
            const body = await req.validate(CreateProductSkuDto, 'body');
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
            const { id } = await req.validate(FindByIdDto, 'params');
            const body = await req.validate(UpdateProductSkuDto, 'body');
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


