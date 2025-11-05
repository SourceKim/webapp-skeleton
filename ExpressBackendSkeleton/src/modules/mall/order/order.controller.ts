import { Router, Request, Response } from 'express'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { OrderService } from './order.service'
import { OrderPreviewDto, CreateOrderDto } from './order.dto'

const router = Router()
const service = new OrderService()

router.use(authMiddleware)

router.post('/preview', async (req: Request, res: Response) => {
  try {
    const dto = (await (req as any).validate(OrderPreviewDto, 'body')) as OrderPreviewDto
    const data = await service.preview(req.user!.id, dto.cart_item_ids)
    res.json({ code: 0, message: 'OK', data })
  } catch (e: any) {
    const status = e?.status || 500
    res.status(status).json({ code: status, message: e?.message || '预览失败' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const dto = (await (req as any).validate(CreateOrderDto, 'body')) as CreateOrderDto
    const order = await service.create(req.user!.id, dto.cart_item_ids, dto.address_id, dto.remark, (dto as any).payment_method)
    res.json({ code: 0, message: 'OK', data: order })
  } catch (e: any) {
    const status = e?.status || 500
    res.status(status).json({ code: status, message: e?.message || '创建失败' })
  }
})

router.get('/', async (req: Request, res: Response) => {
  try {
    const data = await service.list(req.user!.id)
    res.json({ code: 0, message: 'OK', data })
  } catch (e: any) {
    res.status(500).json({ code: 500, message: '获取订单失败' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const data = await service.detail(req.user!.id, req.params.id)
    res.json({ code: 0, message: 'OK', data })
  } catch (e: any) {
    const status = e?.status || 500
    res.status(status).json({ code: status, message: e?.message || '获取详情失败' })
  }
})

router.put('/:id/cancel', async (req: Request, res: Response) => {
  try {
    const data = await service.cancel(req.user!.id, req.params.id)
    res.json({ code: 0, message: 'OK', data })
  } catch (e: any) {
    const status = e?.status || 500
    res.status(status).json({ code: status, message: e?.message || '取消失败' })
  }
})

export default router


