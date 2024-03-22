import { Router } from 'express'
import * as couponController from './coupon.controller.js'
import expressAsyncHandler from 'express-async-handler'
import { auth } from '../../middlewares/auth.middleware.js'
import { validationMiddleware } from '../../middlewares/validation.middleware.js'
import * as couponSchemas from './coupon.validationSchemas.js'
import { endpointsRoles } from './coupon.endpoints.js'
const couponRouter = Router()

couponRouter.get(
  '/disabledCoupons',
  auth(endpointsRoles.GET_DISABLED_OR_ENABLED_COUPOUNS),
  expressAsyncHandler(couponController.getDisabledCoupons)
)
couponRouter.get(
  '/enabledCoupons',
  auth(endpointsRoles.GET_DISABLED_OR_ENABLED_COUPOUNS),
  expressAsyncHandler(couponController.getEnabledCoupons)
)
couponRouter.get(
  '/paginatedCoupons',
  auth(endpointsRoles.GET_DISABLED_OR_ENABLED_COUPOUNS),
  validationMiddleware(couponSchemas.allCouponsPaginatedSchema),
  expressAsyncHandler(couponController.getAllCouponsPaginated)
)
couponRouter.get(
  '/filteredCoupons',
  auth(endpointsRoles.GET_DISABLED_OR_ENABLED_COUPOUNS),
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

couponRouter
  .route('/operation/:couponId')
  .get(
    auth(endpointsRoles.GET_COUPOUN_BY_ID),
    validationMiddleware(couponSchemas.getCouponByIdSchema),
    expressAsyncHandler(couponController.getCouponById)
  )
  .put(
    auth(endpointsRoles.UPDATE_COUPOUN),
    validationMiddleware(couponSchemas.updateCouponSchema),
    expressAsyncHandler(couponController.updateCoupon)
  )
  .delete(
    auth(endpointsRoles.DELETE_COUPOUN),
    expressAsyncHandler(couponController.deleteCoupon)
  )

couponRouter.put(
  '/changeCouponActivation/:couponId',
  auth(endpointsRoles.CHANGE_COUPOUN_ACTIVATION),
  validationMiddleware(couponSchemas.changeCouponActivationSchema),
  expressAsyncHandler(couponController.changeCouponActivation)
)

export default couponRouter
