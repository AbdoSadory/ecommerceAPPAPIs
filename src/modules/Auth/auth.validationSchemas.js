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
      .valid(systemRoles.USER, systemRoles.ADMIN, systemRoles.SUPER_ADMIN)
      .required(),
    age: Joi.number().min(18).max(100).required(),
  }),
}
