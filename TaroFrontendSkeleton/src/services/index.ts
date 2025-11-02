import api from './api'
import authService from './auth'
import productService from './product'
// 移除购物车与订单
import materialService from './material'
import userService from './user'
import mallService from './mall'

export {
  api,
  authService,
  productService,
  mallService,
  materialService
}

export * from './auth'
export * from './product'
export * from './material' 
export { userService }
export * from './mall'