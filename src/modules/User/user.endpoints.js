import { systemRoles } from '../../utils/system-roles.js'

export const endPointsRoles = {
  GET_USER_PROFILE: Object.values(systemRoles),
  UPDATE_USER: Object.values(systemRoles),
  DELETE_USER: Object.values(systemRoles),
}
