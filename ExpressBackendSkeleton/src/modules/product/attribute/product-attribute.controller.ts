import { Request, Response } from 'express';
import type { ApiResponse } from '@skeleton/shared-types';
import { ProductAttributeService } from './product-attribute.service';
import type { ProductAttributeKeyResponseDto, ProductAttributeValueResponseDto } from '@skeleton/shared-types';
import { 
    createProductAttributeKeySchema, 
    updateProductAttributeKeySchema,
    createProductAttributeValueSchema,
    updateProductAttributeValueSchema
} from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';
import { asyncHandler } from '@/utils/async-handler';

export class ProductAttributeController {
    private service = new ProductAttributeService();

    public listKeysBySpu = asyncHandler(async (req: Request, res: Response<ApiResponse<ProductAttributeKeyResponseDto[]>>): Promise<void> => {
        const { spuId } = req.query as { spuId: string };
        const data = await this.service.listKeysBySpu(spuId);
        res.json({ code: 0, message: 'success', data });
    });

    public createKey = asyncHandler(async (req: Request, res: Response<ApiResponse<ProductAttributeKeyResponseDto>>): Promise<void> => {
        const body = validateData(createProductAttributeKeySchema, req.body);
        const data = await this.service.createKey(body);
        res.json({ code: 0, message: '创建成功', data });
    });

    public updateKey = asyncHandler(async (req: Request, res: Response<ApiResponse<ProductAttributeKeyResponseDto>>): Promise<void> => {
        const id = req.params.id;
        const body = validateData(updateProductAttributeKeySchema, req.body);
        const data = await this.service.updateKey(id, body);
        res.json({ code: 0, message: '更新成功', data });
    });

    public deleteKey = asyncHandler(async (req: Request, res: Response<ApiResponse<void>>): Promise<void> => {
        await this.service.deleteKey(req.params.id);
        res.json({ code: 0, message: '删除成功' });
    });

    public createValue = asyncHandler(async (req: Request, res: Response<ApiResponse<ProductAttributeValueResponseDto>>): Promise<void> => {
        const body = validateData(createProductAttributeValueSchema, req.body);
        const data = await this.service.createValue(body);
        res.json({ code: 0, message: '创建成功', data });
    });

    public updateValue = asyncHandler(async (req: Request, res: Response<ApiResponse<ProductAttributeValueResponseDto>>): Promise<void> => {
        const body = validateData(updateProductAttributeValueSchema, req.body);
        const data = await this.service.updateValue(req.params.id, body);
        res.json({ code: 0, message: '更新成功', data });
    });

    public deleteValue = asyncHandler(async (req: Request, res: Response<ApiResponse<void>>): Promise<void> => {
        await this.service.deleteValue(req.params.id);
        res.json({ code: 0, message: '删除成功' });
    });
}


