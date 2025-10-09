import { MaterialTagService } from './material-tag.service';
import { NextFunction, Request, Response } from 'express';
import { ApiResponse, FindByIdDto, PaginatedResponse } from '@/modules/common/common.dto';
import { CreateMaterialTagDTO, MaterialTagDTO } from './material-tag.dto';

export class MaterialTagController {
    private materialTagService: MaterialTagService;

    constructor() {
        this.materialTagService = new MaterialTagService();
    }

    public findAllMaterialTags = async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<MaterialTagDTO>>>,
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
        res: Response<ApiResponse<MaterialTagDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
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
        res: Response<ApiResponse<MaterialTagDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const tagData = await req.validate(CreateMaterialTagDTO, 'body');
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
        res: Response<ApiResponse<MaterialTagDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            const tag = await this.materialTagService.updateMaterialTag(id, req.body);
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
            const { id } = await req.validate(FindByIdDto, 'params');
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
