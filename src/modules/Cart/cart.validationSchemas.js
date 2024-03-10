import Joi from 'joi'

const isObjectId = (value, helper) => {
  const isValid = Types.ObjectId.isValid(value)
  return isValid ? value : helper.message('invalid objectId')
}

export const addProductToCartSchema = {
  body: Joi.object({
    productId: Joi.string().custom(isObjectId).required(),
    quantity: Joi.number().min(1).required(),
  }),
}
