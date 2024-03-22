import Joi from 'joi'
import { generalValidationRule } from '../../utils/general.validation.rule.js'

export const allCouponsPaginatedSchema = {
  query: Joi.object({
    page: Joi.number().min(1).required(),
  }),
}
export const getCouponByIdSchema = {
  params: Joi.object({
    couponId: generalValidationRule.dbId,
  }),
}

export const addCouponSchema = {
  body: Joi.object({
    couponCode: Joi.string().required().min(3).max(10).alphanum(),
    couponAmount: Joi.number().required().min(1),
    isFixed: Joi.boolean(),
    isPercentage: Joi.boolean(),
    fromDate: Joi.date()
      .greater(Date.now() - 24 * 60 * 60 * 1000)
      .required(),
    toDate: Joi.date().greater(Joi.ref('fromDate')).required(),
    Users: Joi.array().items(
      Joi.object({
        userId: generalValidationRule.dbId.required(),
        maxUsage: Joi.number().min(1).required(),
      })
    ),
  }),
}
export const updateCouponSchema = {
  body: Joi.object({
    couponCode: Joi.string().min(3).max(10).alphanum(),
    couponAmount: Joi.number().min(1),
    isFixed: Joi.boolean().valid(true, false),
    isPercentage: Joi.boolean()
      .valid(true, false)
      .when('isFixed', [
        { is: true, then: false },
        { is: false, then: true },
      ]),
    fromDate: Joi.date().greater(Date.now() - 24 * 60 * 60 * 1000),
    toDate: Joi.date().greater(Joi.ref('fromDate')),
  }).with('fromDate', 'toDate'),
}

export const changeCouponActivationSchema = {
  params: Joi.object({
    couponId: generalValidationRule.dbId,
  }),
  query: Joi.object({
    isEnabled: Joi.boolean().valid(true, false).required(),
  }),
}
