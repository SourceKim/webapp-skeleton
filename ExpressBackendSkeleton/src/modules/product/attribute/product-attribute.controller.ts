import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@/modules/common/common.dto';
import { ProductAttributeService } from './product-attribute.service';
import { ProductAttributeKeyDTO, ProductAttributeValueDTO } from './product-attribute.dto';
import { 
    createProductAttributeKeySchema, 
    updateProductAttributeKeySchema,
    createProductAttributeValueSchema,
    updateProductAttributeValueSchema
} from '@skeleton/shared-types';
import { validateData } from '@/utils/zod-validator';

export class ProductAttributeController {
    private service = new ProductAttributeService();

    public listKeysBySpu = async (req: Request, res: Response<ApiResponse<ProductAttributeKeyDTO[]>>, next: NextFunction): Promise<void> => {
        try {
            const { spuId } = req.query as { spuId: string };
            const data = await this.service.listKeysBySpu(spuId);
            res.json({ code: 0, message: 'success', data });
        } catch (error) { next(error); }
    }

    public createKey = async (req: Request, res: Response<ApiResponse<ProductAttributeKeyDTO>>, next: NextFunction): Promise<void> => {
        try {
            const body = validateData(createProductAttributeKeySchema, req.body);
            const data = await this.service.createKey(body);
            res.json({ code: 0, message: '创建成功', data });
        } catch (error) { next(error); }
    }

    public updateKey = async (req: Request, res: Response<ApiResponse<ProductAttributeKeyDTO>>, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const body = validateData(updateProductAttributeKeySchema, req.body);
            const data = await this.service.updateKey(id, body);
            res.json({ code: 0, message: '更新成功', data });
        } catch (error) { next(error); }
    }

    public deleteKey = async (req: Request, res: Response<ApiResponse<void>>, next: NextFunction): Promise<void> => {
        try { await this.service.deleteKey(req.params.id); res.json({ code: 0, message: '删除成功' }); } catch (error) { next(error); }
    }

    public createValue = async (req: Request, res: Response<ApiResponse<ProductAttributeValueDTO>>, next: NextFunction): Promise<void> => {
        try { const body = validateData(createProductAttributeValueSchema, req.body); const data = await this.service.createValue(body); res.json({ code:0, message:'创建成功', data }); } catch (error) { next(error); }
    }

    public updateValue = async (req: Request, res: Response<ApiResponse<ProductAttributeValueDTO>>, next: NextFunction): Promise<void> => {
        try { const body = validateData(updateProductAttributeValueSchema, req.body); const data = await this.service.updateValue(req.params.id, body); res.json({ code:0, message:'更新成功', data }); } catch (error) { next(error); }
    }

    public deleteValue = async (req: Request, res: Response<ApiResponse<void>>, next: NextFunction): Promise<void> => {
        try { await this.service.deleteValue(req.params.id); res.json({ code:0, message:'删除成功' }); } catch (error) { next(error); }
    }
}


