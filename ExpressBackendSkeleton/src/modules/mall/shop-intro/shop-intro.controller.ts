import { Request, Response } from 'express';
import { ShopIntroService } from './shop-intro.service';
import type { ShopIntroResponseDto } from '@skeleton/shared-types';
import type { ApiResponse } from '@skeleton/shared-types';
import { createShopIntroSchema } from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';
import { asyncHandler } from '@/utils/async-handler';

export class ShopIntroController {
    private shopIntroService = new ShopIntroService();

    public getShopIntro = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<ShopIntroResponseDto>>
    ): Promise<void> => {
        const shopIntro = await this.shopIntroService.getShopIntro();
        res.status(200).json({
            code: 0,
            message: '获取店铺介绍成功',
            data: shopIntro || undefined
        });
    });

    public updateShopIntro = asyncHandler(async (
        req: Request,
        res: Response<ApiResponse<ShopIntroResponseDto>>
    ): Promise<void> => {
        const dto = validateData(createShopIntroSchema, req.body);
        const shopIntro = await this.shopIntroService.createOrUpdateShopIntro(dto);
        res.status(200).json({
            code: 0,
            message: '更新店铺介绍成功',
            data: shopIntro
        });
    });
}

