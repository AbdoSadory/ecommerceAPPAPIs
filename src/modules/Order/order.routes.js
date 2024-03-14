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

orderRouter.post(
  '/stripePay/:orderId',
  auth([systemRoles.USER]),
  expressAsyncHandler(orderController.payWithStripe)
)

orderRouter.post(
  '/webhook',
  expressAsyncHandler(orderController.stripeWebhookLocal)
)

orderRouter.post(
  '/refund/:orderId',
  auth([systemRoles.SUPER_ADMIN, systemRoles.ADMIN]),
  expressAsyncHandler(orderController.refundOrder)
)
export default orderRouter
