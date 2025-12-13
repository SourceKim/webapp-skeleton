import { MaterialTagService } from './material-tag.service';
import { NextFunction, Request, Response } from 'express';
import type { ApiResponse, PaginatedResponse } from '@skeleton/shared-types';
import type { MaterialTagResponseDto } from '@skeleton/shared-types';
import { createMaterialTagSchema, updateMaterialTagSchema } from '@skeleton/shared-types';
import { idParamSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';

export class MaterialTagController {
    private materialTagService: MaterialTagService;

    constructor() {
        this.materialTagService = new MaterialTagService();
    }

    public findAllMaterialTags = async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<MaterialTagResponseDto>>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { tags, total } = await this.materialTagService.findAllMaterialTags(req.pagination);
            return res.pagination(tags, total);
        } catch (error) {
            next(error);
        }
    }

    public findMaterialTagById = async (
        req: Request,
        res: Response<ApiResponse<MaterialTagResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            const tag = await this.materialTagService.findMaterialTagById(id);
            res.json({
                code: 0,
                message: 'success',
                data: tag
            });
        } catch (error) {
            next(error);
        }
    }

    public createMaterialTag = async (
        req: Request,
        res: Response<ApiResponse<MaterialTagResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const tagData = validateData(createMaterialTagSchema, req.body);
            const tag = await this.materialTagService.createMaterialTag(tagData);
            res.json({
                code: 0,
                message: 'success',
                data: tag
            });
        } catch (error) {
            next(error);
        }
    }

    public updateMaterialTag = async (
        req: Request,
        res: Response<ApiResponse<MaterialTagResponseDto>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            const tagData = validateData(updateMaterialTagSchema, req.body);
            const tag = await this.materialTagService.updateMaterialTag(id, tagData);
            res.json({
                code: 0,
                message: 'success',
                data: tag
            });
        } catch (error) {
            next(error);
        }
    }

    public deleteMaterialTag = async (
        req: Request,
        res: Response<ApiResponse<void>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = validateData(idParamSchema, req.params);
            await this.materialTagService.deleteMaterialTag(id);
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
