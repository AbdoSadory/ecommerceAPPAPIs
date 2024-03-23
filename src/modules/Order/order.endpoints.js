import { systemRoles } from '../../utils/system-roles.js'

export const endpointsRoles = {
  CREATE_ORDER: [systemRoles.USER],
  ADD_CART_TO_ORDER: [systemRoles.USER],
  DELIVERED_ORDER: [systemRoles.DELIVERER],
  REFUND_ORDER: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN],
  PAY_WITH_STRIPE: [systemRoles.USER],
}
