import { systemRoles } from '../../utils/system-roles.js'

export const endPointsRoles = {
  GET_PRODUCT_REVIEWS: Object.values(systemRoles),
  ADD_REVIEW: [systemRoles.USER],
  DELETE_REVIEW: [systemRoles.USER],
}
