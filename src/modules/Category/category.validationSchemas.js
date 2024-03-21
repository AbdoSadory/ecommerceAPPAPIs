import Joi from 'joi'

export const allCategoriesPaginatedSchema = {
  query: Joi.object({
    page: Joi.number().min(1).required(),
  }),
}
