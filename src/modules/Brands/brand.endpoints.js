import { systemRoles } from '../../utils/system-roles.js'

export const endPointsRoles = {
  GET_ALL_BRAND: Object.values(systemRoles),
  GET_CATEGORY_BRANDS: Object.values(systemRoles),
  GET_SUB_CATEGORY_BRANDS: Object.values(systemRoles),
  ADD_BRAND: [systemRoles.SUPER_ADMIN, systemRoles.ADMIN],
  UPDATE_BRAND: [systemRoles.SUPER_ADMIN, systemRoles.ADMIN],
  DELETE_BRAND: [systemRoles.SUPER_ADMIN, systemRoles.ADMIN],
}
