import { Request, Response, NextFunction } from 'express';
import { ApiResponse, FindByIdDto, PaginatedResponse } from '@/modules/common/common.dto';
import { ProductCategoryDTO, CreateProductCategoryDto, UpdateProductCategoryDto } from './product-category.dto';
import { ProductCategoryService } from './product-category.service';

export class ProductCategoryController {
    private service = new ProductCategoryService();

    public list = async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<ProductCategoryDTO>>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const parentIdParam = (req.query.parent_id as string | undefined);
            const parentId = parentIdParam === undefined ? undefined : (parentIdParam === 'null' ? (null as any) : parentIdParam);
            const level = req.query.level ? parseInt(req.query.level as string) : undefined;
            const { items, total } = await this.service.findAll(req.pagination, parentId, level);
            return res.pagination(items, total);
        } catch (error) {
            next(error);
        }
    };

    public detail = async (
        req: Request,
        res: Response<ApiResponse<ProductCategoryDTO>>,
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
        res: Response<ApiResponse<ProductCategoryDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const body = await req.validate(CreateProductCategoryDto, 'body');
            const data = await this.service.create(body);
            res.status(200).json({ code: 0, message: '创建成功', data });
        } catch (error) {
            next(error);
        }
    };

    public update = async (
        req: Request,
        res: Response<ApiResponse<ProductCategoryDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            const body = await req.validate(UpdateProductCategoryDto, 'body');
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


