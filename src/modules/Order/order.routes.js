import { Router } from 'express'

import * as orderController from './order.controller.js'
import { auth } from '../../middlewares/auth.middleware.js'
import { systemRoles } from '../../utils/system-roles.js'
import expressAsyncHandler from 'express-async-handler'

const orderRouter = Router()

orderRouter.post(
  '/',
  auth([systemRoles.USER]),
  expressAsyncHandler(orderController.createOrder)
)

orderRouter.post(
  '/cartToOrder',
  auth([systemRoles.USER]),
  expressAsyncHandler(orderController.convertFromcartToOrder)
)

orderRouter.put(
  '/:orderId',
  auth([systemRoles.DELIVERER]),
  expressAsyncHandler(orderController.delieverOrder)
)

export default orderRouter
