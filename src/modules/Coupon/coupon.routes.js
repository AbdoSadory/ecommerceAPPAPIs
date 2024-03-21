import { Router } from 'express'
import * as couponController from './coupon.controller.js'
import expressAsyncHandler from 'express-async-handler'
import { auth } from '../../middlewares/auth.middleware.js'
import { validationMiddleware } from '../../middlewares/validation.middleware.js'
import * as couponSchemas from './coupon.validationSchemas.js'
import { endpointsRoles } from './coupon.endpoints.js'
const couponRouter = Router()

couponRouter.get(
  '/paginatedCoupons',
  validationMiddleware(couponSchemas.allCouponsPaginatedSchema),
  expressAsyncHandler(couponController.getAllCouponsPaginated)
)
couponRouter.get(
  '/filteredCoupons',
  expressAsyncHandler(couponController.getAllCouponsFiltered)
)
couponRouter.post(
  '/',
  auth(endpointsRoles.ADD_COUPOUN),
  validationMiddleware(couponSchemas.addCouponSchema),
  expressAsyncHandler(couponController.addCoupon)
)

couponRouter.post(
  '/valid',
  auth(endpointsRoles.ADD_COUPOUN),
  expressAsyncHandler(couponController.validateCouponApi)
)

export default couponRouter
