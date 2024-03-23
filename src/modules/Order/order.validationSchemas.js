import Joi from 'joi'
import { generalValidationRule } from '../../utils/general.validation.rule.js'

export const addOrderSchema = {
  body: Joi.object({
    product: generalValidationRule.dbId,
    quantity: Joi.number().min(1).required(),
    couponCode: Joi.string(),
    paymentMethod: Joi.string().valid('Cash', 'Stripe', 'Paymob').required(),
    phoneNumbers: Joi.array().items(Joi.string().required()).required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
  }),
}
export const addCartToOrderSchema = {
  body: Joi.object({
    couponCode: Joi.string(),
    paymentMethod: Joi.string().valid('Cash', 'Stripe', 'Paymob').required(),
    phoneNumbers: Joi.array().items(Joi.string().required()).required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
  }),
}

export const deliverOrderSchema = {
  params: Joi.object({
    orderId: generalValidationRule.dbId,
  }),
}
export const payWithStripeSchema = {
  params: Joi.object({
    orderId: generalValidationRule.dbId,
  }),
}
export const refundOrderSchema = {
  params: Joi.object({
    orderId: generalValidationRule.dbId,
  }),
}
