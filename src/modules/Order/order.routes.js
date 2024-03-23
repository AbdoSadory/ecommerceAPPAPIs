import { Router } from 'express'

import * as orderController from './order.controller.js'
import { auth } from '../../middlewares/auth.middleware.js'
import { systemRoles } from '../../utils/system-roles.js'
import expressAsyncHandler from 'express-async-handler'
import { endpointsRoles } from './order.endpoints.js'
import * as orderSchemas from './order.validationSchemas.js'
import { validationMiddleware } from '../../middlewares/validation.middleware.js'
const orderRouter = Router()

orderRouter.post(
  '/',
  auth(endpointsRoles.CREATE_ORDER),
  validationMiddleware(orderSchemas.addOrderSchema),
  expressAsyncHandler(orderController.createOrder)
)

orderRouter.post(
  '/cartToOrder',
  auth(endpointsRoles.ADD_CART_TO_ORDER),
  validationMiddleware(orderSchemas.addCartToOrderSchema),
  expressAsyncHandler(orderController.convertFromcartToOrder)
)

orderRouter.put(
  '/:orderId',
  auth(endpointsRoles.DELIVERED_ORDER),
  validationMiddleware(orderSchemas.deliverOrderSchema),
  expressAsyncHandler(orderController.delieverOrder)
)

orderRouter.post(
  '/stripePay/:orderId',
  auth(endpointsRoles.PAY_WITH_STRIPE),
  validationMiddleware(orderSchemas.payWithStripeSchema),
  expressAsyncHandler(orderController.payWithStripe)
)

orderRouter.post(
  '/webhook',
  expressAsyncHandler(orderController.stripeWebhookLocal)
)

orderRouter.post(
  '/refund/:orderId',
  auth(endpointsRoles.REFUND_ORDER),
  validationMiddleware(orderSchemas.refundOrderSchema),
  expressAsyncHandler(orderController.refundOrder)
)
export default orderRouter
