import cloudinaryConnection from '../../utils/cloudinary.js'
import axios from 'axios'
import { APIFeatures } from '../../utils/api-features.js'
import orderModel from '../../../DB/Models/order.model.js'
import reviewModel from '../../../DB/Models/review.model.js'
import productModel from '../../../DB/Models/product.model.js'
import { DateTime } from 'luxon'

//======================= add Review =======================//
export const addReview = async (req, res, next) => {
  // 1- desturcture the required data from the request object
  const { _id } = req.authUser
  const { productId } = req.query
  const { comment, rate } = req.body

  // 2- Check Product is existed and delivered to be reviewed
  const isProductValidToBeReviewed = await orderModel.findOne({
    user: _id,
    'orderItems.product': productId,
    orderStatus: 'Delivered',
  })

  if (!isProductValidToBeReviewed)
    return next(
      new Error(
        'This product is not valid to be reviewed, product must be delivered first.',
        { cause: 400 }
      )
    )
  // 3- create review
  const reviewObject = {
    userId: _id,
    productId,
    reviewComment: comment,
    reviewRate: rate,
  }
  const newReview = await reviewModel.create(reviewObject)
  if (!newReview) return next(new Error('Error while creating review'))

  // get product to update its rate
  const product = await productModel
    .findById(productId)
    .populate('Reviews', 'reviewRate')
  let sumOfRate = 0
  for (const review of product.Reviews) {
    sumOfRate += review.reviewRate
  }
  product.rate = (sumOfRate / product.Reviews.length).toPrecision(2)
  await product.save()

  res.status(201).json({
    message: 'Review has been added successfully',
    newReview,
    product,
  })
}

// ===================== get product reviews ===================//
export const getProductReviews = async (req, res, next) => {
  const { productId } = req.query
  const productReviews = await reviewModel.find({ productId })
  if (!productReviews)
    return next(new Error('Error while getting product reviews'))

  res.status(200).json({ message: 'Product reviews', productReviews })
}

// ===================== delete review ===================//
export const deleteReview = async (req, res, next) => {
  // 1- destructuring the supplied data from request object
  const { reviewId } = req.params
  const { _id } = req.authUser

  // 2- check if the review is exist by using reviewId
  const isReviewExisted = await reviewModel.findOneAndDelete({
    _id: reviewId,
    userId: _id,
  })
  if (!isReviewExisted)
    return next(new Error('No review with this id and userId', { cause: 404 }))

  res.status(200).json({ message: 'Review has been deleted successfully' })
}
