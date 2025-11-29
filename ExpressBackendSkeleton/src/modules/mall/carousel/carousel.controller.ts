import { Request, Response, NextFunction } from 'express';
import { CarouselService } from './carousel.service';
import { CreateCarouselDto, UpdateCarouselDto, CarouselDTO } from './carousel.dto';
import { FindByIdDto, ApiResponse, PaginatedResponse } from '../../common/common.dto';

export class CarouselController {
    private carouselService = new CarouselService();

    public createCarousel = async (
        req: Request,
        res: Response<ApiResponse<CarouselDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const dto = await req.validate(CreateCarouselDto, 'body');
            const carousel = await this.carouselService.createCarousel(dto);
            res.status(200).json({
                code: 0,
                message: '创建轮播图成功',
                data: carousel
            });
        } catch (error) {
            next(error);
        }
    };

    public updateCarousel = async (
        req: Request,
        res: Response<ApiResponse<CarouselDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            const dto = await req.validate(UpdateCarouselDto, 'body');
            const carousel = await this.carouselService.updateCarousel(id, dto);
            res.status(200).json({
                code: 0,
                message: '更新轮播图成功',
                data: carousel
            });
        } catch (error) {
            next(error);
        }
    };

    public deleteCarousel = async (
        req: Request,
        res: Response<ApiResponse<void>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            await this.carouselService.deleteCarousel(id);
            res.status(200).json({
                code: 0,
                message: '删除轮播图成功'
            });
        } catch (error) {
            next(error);
        }
    };

    public getCarousel = async (
        req: Request,
        res: Response<ApiResponse<CarouselDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = await req.validate(FindByIdDto, 'params');
            const carousel = await this.carouselService.findOne(id);
            res.status(200).json({
                code: 0,
                message: '获取轮播图成功',
                data: carousel
            });
        } catch (error) {
            next(error);
        }
    };

    public getCarousels = async (
        req: Request,
        res: Response<ApiResponse<PaginatedResponse<CarouselDTO>>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { items, total } = await this.carouselService.findAll(req.pagination);
            return res.pagination(items, total);
        } catch (error) {
            next(error);
        }
    };
}

