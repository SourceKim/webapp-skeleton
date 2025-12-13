import { MaterialTagService } from './material-tag.service';
import { Request, Response } from 'express';
import type { ApiResponse, PaginatedResponse } from '@skeleton/shared-types';
import type { MaterialTagResponseDto } from '@skeleton/shared-types';
import { createMaterialTagSchema, updateMaterialTagSchema } from '@skeleton/shared-types';
import { idParamSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';
import { asyncHandler } from '@/utils/async-handler';

export class MaterialTagController {
    private materialTagService: MaterialTagService;

    constructor() {
        this.materialTagService = new MaterialTagService();
    }

    public findAllMaterialTags = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<MaterialTagResponseDto>>>
    ): Promise<void> => {
        const { tags, total } = await this.materialTagService.findAllMaterialTags(req.pagination);
        return res.pagination(tags, total);
    });

    public findMaterialTagById = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<MaterialTagResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const tag = await this.materialTagService.findMaterialTagById(id);
        res.json({
            code: 0,
            message: 'success',
            data: tag
        });
    });

    public createMaterialTag = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<MaterialTagResponseDto>>
    ): Promise<void> => {
        const tagData = validateData(createMaterialTagSchema, req.body);
        const tag = await this.materialTagService.createMaterialTag(tagData);
        res.json({
            code: 0,
            message: 'success',
            data: tag
        });
    });

    public updateMaterialTag = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<MaterialTagResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const tagData = validateData(updateMaterialTagSchema, req.body);
        const tag = await this.materialTagService.updateMaterialTag(id, tagData);
        res.json({
            code: 0,
            message: 'success',
            data: tag
        });
    });

    public deleteMaterialTag = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<void>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        await this.materialTagService.deleteMaterialTag(id);
        res.json({
            code: 0,
            message: 'success',
            data: undefined
        });
    });
}
