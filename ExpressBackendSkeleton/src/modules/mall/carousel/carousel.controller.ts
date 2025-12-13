import { Request, Response } from 'express';
import { CarouselService } from './carousel.service';
import type { CarouselResponseDto } from '@skeleton/shared-types';
import type { ApiResponse, PaginatedResponse } from '@skeleton/shared-types';
import { createCarouselSchema, updateCarouselSchema } from '@skeleton/shared-types';
import { idParamSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';
import { asyncHandler } from '@/utils/async-handler';

export class CarouselController {
    private carouselService = new CarouselService();

    public createCarousel = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<CarouselResponseDto>>
    ): Promise<void> => {
        const dto = validateData(createCarouselSchema, req.body);
        const carousel = await this.carouselService.createCarousel(dto);
        res.status(200).json({
            code: 0,
            message: '创建轮播图成功',
            data: carousel
        });
    });

    public updateCarousel = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<CarouselResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const dto = validateData(updateCarouselSchema, req.body);
        const carousel = await this.carouselService.updateCarousel(id, dto);
        res.status(200).json({
            code: 0,
            message: '更新轮播图成功',
            data: carousel
        });
    });

    public deleteCarousel = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<void>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        await this.carouselService.deleteCarousel(id);
        res.status(200).json({
            code: 0,
            message: '删除轮播图成功'
        });
    });

    public getCarousel = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<CarouselResponseDto>>
    ): Promise<void> => {
        const { id } = validateData(idParamSchema, req.params);
        const carousel = await this.carouselService.findOne(id);
        res.status(200).json({
            code: 0,
            message: '获取轮播图成功',
            data: carousel
        });
    });

    public getCarousels = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<CarouselResponseDto>>>
    ): Promise<void> => {
        const { items, total } = await this.carouselService.findAll(req.pagination);
        return res.pagination(items, total);
    });
}

