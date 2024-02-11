import { systemRoles } from '../../utils/system-roles.js'

export const endPointsRoles = {
  ADD_SUB_CATEGORY: [systemRoles.SUPER_ADMIN],
  ALL_SUB_CATEGORIES_WITH_BRANDS: [
    systemRoles.SUPER_ADMIN,
    systemRoles.ADMIN,
    systemRoles.USER,
  ],
  UPDATE_SUB_CATEGORY: [systemRoles.SUPER_ADMIN],
  DELETE_SUB_CATEGORY: [systemRoles.SUPER_ADMIN],
}
