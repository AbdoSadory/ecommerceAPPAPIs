import Joi from 'joi'
import { Types } from 'mongoose'

const isObjectId = (value, helper) => {
  const isValid = Types.ObjectId.isValid(value)
  return isValid ? value : helper.message('invalid objectId')
}

export const createProductSchema = {
  query: Joi.object({
    brandId: Joi.string().custom(isObjectId).required(),
    categoryId: Joi.string().custom(isObjectId).required(),
    subCategoryId: Joi.string().custom(isObjectId).required(),
  }),
  body: Joi.object({
    title: Joi.string().min(4).required(),
    desc: Joi.string().required(),
    basePrice: Joi.string().required(),
    discount: Joi.string().required(),
    stock: Joi.string().required(),
    specs: Joi.string().required(),
  }),
}
export const updateProductSchema = {
  params: Joi.object({ productId: Joi.string().custom(isObjectId) }),
  query: Joi.object({
    brandId: Joi.string().custom(isObjectId).required(),
    categoryId: Joi.string().custom(isObjectId).required(),
    subCategoryId: Joi.string().custom(isObjectId).required(),
  }),
  body: Joi.object({
    title: Joi.string(),
    desc: Joi.string(),
    basePrice: Joi.string(),
    discount: Joi.string(),
    stock: Joi.string(),
    specs: Joi.string(),
    oldPublicId: Joi.string(),
  }),
}

export const deleteProductSchema = {
  params: Joi.object({ productId: Joi.string().custom(isObjectId) }),
}
export const getProductByIdSchema = {
  params: Joi.object({ productId: Joi.string().custom(isObjectId) }),
}

export const searchProductSchema = {
  body: Joi.object({
    title: Joi.string(),
    desc: Joi.string(),
    discount: Joi.string(),
    priceFrom: Joi.string(),
    priceTo: Joi.string(),
    rateFrom: Joi.string(),
    rateTo: Joi.string(),
    specs: Joi.string(),
    addedBy: Joi.string().custom(isObjectId),
    categoryId: Joi.string().custom(isObjectId),
    subCategoryId: Joi.string().custom(isObjectId),
  }),
}

export const deleteProductsByBrandIdSchema = {
  query: Joi.object({ brandId: Joi.string().custom(isObjectId).required() }),
}
