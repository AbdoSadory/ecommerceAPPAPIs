import { systemRoles } from '../../utils/system-roles.js'

export const endpointsRoles = {
  ADD_COUPOUN: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
  UPDATE_COUPOUN: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
  DELETE_COUPOUN: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
  CHANGE_COUPOUN_ACTIVATION: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
  GET_ALL_COUPOUNS: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
  GET_COUPOUN_BY_ID: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
  GET_DISABLED_OR_ENABLED_COUPOUNS: [
    systemRoles.ADMIN,
    systemRoles.SUPER_ADMIN,
  ],
}
