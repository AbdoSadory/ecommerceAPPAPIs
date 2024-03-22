import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'
import * as reviewControllers from './review.controller.js'
import { endPointsRoles } from './review.endpoints.js'
import { auth } from '../../middlewares/auth.middleware.js'
import { validationMiddleware } from '../../middlewares/validation.middleware.js'
import * as reviewValidationSchemas from './review.validationSchemas.js'
const router = Router()

router.get(
  '/productReviews',
  auth(endPointsRoles.GET_PRODUCT_REVIEWS),
  validationMiddleware(reviewValidationSchemas.getProductReviewsSchema),
  expressAsyncHandler(reviewControllers.getProductReviews)
)
router.post(
  '/',
  auth(endPointsRoles.ADD_REVIEW),
  validationMiddleware(reviewValidationSchemas.addReviewSchema),
  expressAsyncHandler(reviewControllers.addReview)
)

router
  .route('/:reviewId')
  .delete(
    auth(endPointsRoles.DELETE_REVIEW),
    validationMiddleware(reviewValidationSchemas.deleteReviewSchema),
    expressAsyncHandler(reviewControllers.deleteReview)
  )
export default router
