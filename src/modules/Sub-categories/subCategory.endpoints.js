import { systemRoles } from '../../utils/system-roles.js'

export const endPointsRoles = {
  ADD_SUB_CATEGORY: [systemRoles.SUPER_ADMIN],
  ALL_SUB_CATEGORIES_WITH_BRANDS: Object.values(systemRoles),
  GET_SUB_CATEGORY: Object.values(systemRoles),
  UPDATE_SUB_CATEGORY: [systemRoles.SUPER_ADMIN],
  DELETE_SUB_CATEGORY: [systemRoles.SUPER_ADMIN],
}
