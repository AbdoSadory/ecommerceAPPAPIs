import Joi from 'joi'
import { Types } from 'mongoose'

const isObjectId = (value, helper) => {
  const isValid = Types.ObjectId.isValid(value)
  return isValid ? value : helper.message('invalid objectId')
}

export const getProductReviewsSchema = {
  query: Joi.object({
    productId: Joi.string().custom(isObjectId).required(),
  }),
}
export const addReviewSchema = {
  body: Joi.object({
    comment: Joi.string().min(10),
    rate: Joi.number().min(0).max(5).required(),
  }),
  query: Joi.object({
    productId: Joi.string().custom(isObjectId).required(),
  }),
}

export const deleteReviewSchema = {
  params: Joi.object({ reviewId: Joi.string().custom(isObjectId) }),
}
