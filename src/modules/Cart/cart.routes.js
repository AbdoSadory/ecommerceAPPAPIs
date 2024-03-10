import { Router } from 'express'
import * as cartController from './cart.controller.js'
import expressAsyncHandler from 'express-async-handler'
import { auth } from '../../middlewares/auth.middleware.js'
import { systemRoles } from '../../utils/system-roles.js'
import { validationMiddleware } from '../../middlewares/validation.middleware.js'
import * as cartValidationSchemas from './cart.validationSchemas.js'
const router = Router()

router.post(
  '/',
  auth([systemRoles.USER]),
  validationMiddleware(cartValidationSchemas.addProductToCartSchema),
  expressAsyncHandler(cartController.addProductToCart)
)

router.put(
  '/:productId',
  auth([systemRoles.USER]),
  expressAsyncHandler(cartController.removeFromcart)
)

export default router
