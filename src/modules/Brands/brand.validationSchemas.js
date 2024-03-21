import Joi from 'joi'
import { Types } from 'mongoose'

const isObjectId = (value, helper) => {
  const isValid = Types.ObjectId.isValid(value)
  return isValid ? value : helper.message('invalid objectId')
}

export const getBrandsByCategory = {
  query: Joi.object({
    categoryId: Joi.string().custom(isObjectId).required(),
  }),
}
export const getBrandsBySubCategory = {
  query: Joi.object({
    subCategoryId: Joi.string().custom(isObjectId).required(),
  }),
}
export const allBrandsPaginatedSchema = {
  query: Joi.object({
    page: Joi.number().min(1).required(),
  }),
}

export const updateBrandSchema = {
  params: Joi.object({ brandId: Joi.string().custom(isObjectId) }),
  body: Joi.object({ name: Joi.string(), oldPublicId: Joi.string() }),
  query: Joi.object({
    subCategoryId: Joi.string().custom(isObjectId).required(),
    categoryId: Joi.string().custom(isObjectId).required(),
  }),
}

export const deleteBrandSchema = {
  params: Joi.object({ brandId: Joi.string().custom(isObjectId) }),
  query: Joi.object({
    subCategoryId: Joi.string().custom(isObjectId).required(),
    categoryId: Joi.string().custom(isObjectId).required(),
  }),
}
