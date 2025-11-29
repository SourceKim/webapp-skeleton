import { Request, Response, NextFunction } from 'express';
import { ShopIntroService } from './shop-intro.service';
import { CreateShopIntroDto, ShopIntroDTO } from './shop-intro.dto';
import { ApiResponse } from '../../common/common.dto';

export class ShopIntroController {
    private shopIntroService = new ShopIntroService();

    public getShopIntro = async (
        req: Request,
        res: Response<ApiResponse<ShopIntroDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const shopIntro = await this.shopIntroService.getShopIntro();
            res.status(200).json({
                code: 0,
                message: '获取店铺介绍成功',
                data: shopIntro || undefined
            });
        } catch (error) {
            next(error);
        }
    };

    public updateShopIntro = async (
        req: Request,
        res: Response<ApiResponse<ShopIntroDTO>>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const dto = await req.validate(CreateShopIntroDto, 'body');
            const shopIntro = await this.shopIntroService.createOrUpdateShopIntro(dto);
            res.status(200).json({
                code: 0,
                message: '更新店铺介绍成功',
                data: shopIntro
            });
        } catch (error) {
            next(error);
        }
    };
}

