import { Router } from 'express'
import orderController from './order.controller'

const router = Router()
router.use('/', orderController)
export default router








