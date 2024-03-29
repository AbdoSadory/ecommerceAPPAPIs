import Joi from 'joi'
import { systemRoles } from '../../utils/system-roles.js'

export const signUpSchema = {
  body: Joi.object({
    username: Joi.string().min(3).max(20).lowercase().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required(),
    phoneNumbers: Joi.array().items(Joi.string()).required(),
    addresses: Joi.array().items(Joi.string()).required(),
    role: Joi.string()
      .valid(...Object.values(systemRoles))
      .required(),
    age: Joi.number().min(18).max(100).required(),
  }),
}

export const signInSchema = {
  body: Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required(),
  }),
}
export const forgetPasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().lowercase().required(),
  }),
}
export const resetPasswordSchema = {
  body: Joi.object({
    otp: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    newPassword: Joi.string().min(8).required(),
  })
    .with('otp', 'email')
    .with('email', 'newPassword'),
}
