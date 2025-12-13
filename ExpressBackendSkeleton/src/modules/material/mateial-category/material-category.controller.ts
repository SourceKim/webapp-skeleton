import { MaterialCategoryService } from '@/modules/material/mateial-category/material-category.service';
import { Request, Response } from 'express';
import type { ApiResponse, PaginatedResponse } from '@skeleton/shared-types';
import type { MaterialCategoryResponseDto } from '@skeleton/shared-types';
import { createMaterialCategorySchema, updateMaterialCategorySchema } from '@skeleton/shared-types';
import { idParamSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';
import { asyncHandler } from '@/utils/async-handler';

export class MaterialCategoryController {
    private materialCategoryService: MaterialCategoryService;

    constructor() {
        this.materialCategoryService = new MaterialCategoryService();
    }

    public findAllMaterialCategories = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<MaterialCategoryResponseDto>>>
    ): Promise<void> => {
        const { categories, total } = await this.materialCategoryService.findAllMaterialCategories(req.pagination);
        return res.pagination(categories, total);
    });

    public findMaterialCategoryById = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<MaterialCategoryResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const category = await this.materialCategoryService.findMaterialCategoryById(id);
        res.json({
            code: 0,
            message: 'success',
            data: category
        });
    });

    public createMaterialCategory = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<MaterialCategoryResponseDto>>
    ): Promise<void> => {
        const categoryData = validateData(createMaterialCategorySchema, req.body);
        const category = await this.materialCategoryService.createMaterialCategory(categoryData);
        res.json({
            code: 0,
            message: 'success',
            data: category
        });
    });

    public updateMaterialCategory = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<MaterialCategoryResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const categoryData = validateData(updateMaterialCategorySchema, req.body);
        const category = await this.materialCategoryService.updateMaterialCategory(id, categoryData);
        res.json({
            code: 0,
            message: 'success',
            data: category
        });
    });

    public deleteMaterialCategory = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<void>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        await this.materialCategoryService.deleteMaterialCategory(id);
        res.json({
            code: 0,
            message: 'success',
            data: undefined
        });
    });
}
