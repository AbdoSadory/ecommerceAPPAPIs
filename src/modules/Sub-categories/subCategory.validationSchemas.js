import Joi from 'joi'
import { Types } from 'mongoose'

const isObjectId = (value, helper) => {
  const isValid = Types.ObjectId.isValid(value)
  return isValid ? value : helper.message('invalid objectId')
}

export const updateSubCategorySchema = {
  params: Joi.object({ subCategoryId: Joi.string().custom(isObjectId) }),
  body: Joi.object({ name: Joi.string(), oldPublicId: Joi.string() }),
}

export const deleteSubCategorySchema = {
  params: Joi.object({ subCategoryId: Joi.string().custom(isObjectId) }),
}
