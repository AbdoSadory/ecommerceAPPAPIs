import Joi from 'joi'
import { systemRoles } from '../../utils/system-roles.js'
import { Types } from 'mongoose'

const isObjectId = (value, helper) => {
  const isValid = Types.ObjectId.isValid(value)
  return isValid ? value : helper.message('invalid objectId')
}
export const updateUserSchema = {
  body: Joi.object({
    username: Joi.string().min(3).max(20).lowercase(),
    email: Joi.string().email().lowercase(),
    password: Joi.string().min(8),
    phoneNumbers: Joi.array().items(Joi.string()),
    addresses: Joi.array().items(Joi.string()),
    role: Joi.string().valid(...Object.values(systemRoles)),
    age: Joi.number().min(18).max(100),
  }),
}

export const getUserSchema = {
  params: Joi.object({
    userId: Joi.string().custom(isObjectId),
  }),
}
export const updatePasswordSchema = {
  body: Joi.object({
    oldPassword: Joi.string().trim().alphanum().min(6).required(),
    newPassword: Joi.string()
      .trim()
      .alphanum()
      .min(6)
      .disallow(Joi.ref('oldPassword'))
      .required()
      .messages({
        '*': 'new password should not be the same like old password and with minimum length 6 characters',
      }),
  }).with('newPassword', 'oldPassword'),
}
