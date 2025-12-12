import { MaterialCategoryService } from '@/modules/material/mateial-category/material-category.service';
import { NextFunction, Request, Response } from 'express';
import { ApiResponse, PaginatedResponse } from '@/modules/common/common.dto';
import { MaterialCategoryDTO } from './material-category.dto';
import { createMaterialCategorySchema, updateMaterialCategorySchema } from '@skeleton/shared-types';
import { idParamSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';

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
            const { id } = validateData(idParamSchema, req.params);
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
            const categoryData = validateData(createMaterialCategorySchema, req.body);
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
            const { id } = validateData(idParamSchema, req.params);
            const categoryData = validateData(updateMaterialCategorySchema, req.body);
            const category = await this.materialCategoryService.updateMaterialCategory(id, categoryData);
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
            const { id } = validateData(idParamSchema, req.params);
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
