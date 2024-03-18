import { systemRoles } from '../../utils/system-roles.js'

export const endPointsRoles = {
  GET_CATEGORY: Object.values(systemRoles),
  ADD_CATEGORY: [systemRoles.SUPER_ADMIN],
  UPDATE_CATEGORY: [systemRoles.SUPER_ADMIN],
  DELETE_CATEGORY: [systemRoles.SUPER_ADMIN],
}
