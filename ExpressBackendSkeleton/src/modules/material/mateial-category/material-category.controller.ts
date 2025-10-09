import { MaterialCategoryService } from '@/modules/material/mateial-category/material-category.service';
import { NextFunction, Request, Response } from 'express';
import { ApiResponse, FindByIdDto, PaginatedResponse } from '@/modules/common/common.dto';
import { CreateMaterialCategoryDto, MaterialCategoryDTO } from './material-category.dto';

export class MaterialCategoryController {
    private materialCategoryService: MaterialCategoryService;

    constructor() {
        this.materialCategoryService = new MaterialCategoryService();
    }

    public findAllMaterialCategories = async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<MaterialCategoryDTO>>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { categories, total } = await this.materialCategoryService.findAllMaterialCategories(req.pagination);
            return res.pagination(categories, total);
        } catch (error) {
            next(error);
        }
    }

    public findMaterialCategoryById = async (
        req: Request,
        res: Response<ApiResponse<MaterialCategoryDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            const category = await this.materialCategoryService.findMaterialCategoryById(id);
            res.json({
                code: 0,
                message: 'success',
                data: category
            });
        } catch (error) {
            next(error);
        }
    }

    public createMaterialCategory = async (
        req: Request,
        res: Response<ApiResponse<MaterialCategoryDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const categoryData = await req.validate(CreateMaterialCategoryDto, 'body');
            const category = await this.materialCategoryService.createMaterialCategory(categoryData);
            res.json({
                code: 0,
                message: 'success',
                data: category
            });
        } catch (error) {
            next(error);
        }
    }

    public updateMaterialCategory = async (
        req: Request,
        res: Response<ApiResponse<MaterialCategoryDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            const category = await this.materialCategoryService.updateMaterialCategory(id, req.body);
            res.json({
                code: 0,
                message: 'success',
                data: category
            });
        } catch (error) {
            next(error);
        }
    }

    public deleteMaterialCategory = async (
        req: Request,
        res: Response<ApiResponse<void>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            await this.materialCategoryService.deleteMaterialCategory(id);
            res.json({
                code: 0,
                message: 'success',
                data: undefined
            });
        } catch (error) {
            next(error);
        }
    }
}
