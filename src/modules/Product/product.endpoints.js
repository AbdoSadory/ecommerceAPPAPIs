import { systemRoles } from '../../utils/system-roles.js'

export const endPointsRoles = {
  ADD_PRODUCT: [systemRoles.SUPER_ADMIN, systemRoles.ADMIN],
  UPDATE_PRODUCT: [systemRoles.SUPER_ADMIN, systemRoles.ADMIN],
  DELETE_PRODUCT: [systemRoles.SUPER_ADMIN, systemRoles.ADMIN],
  DELETE_PRODUCTS_BY_BRAND_ID: [systemRoles.SUPER_ADMIN, systemRoles.ADMIN],
  GET_PRODUCT_By_ID: [
    systemRoles.SUPER_ADMIN,
    systemRoles.ADMIN,
    systemRoles.USER,
  ],
  SEARCH_ON_PRODUCT: [
    systemRoles.SUPER_ADMIN,
    systemRoles.ADMIN,
    systemRoles.USER,
  ],
  ALL_PRODUCTS: [systemRoles.SUPER_ADMIN, systemRoles.ADMIN, systemRoles.USER],
  ALL_PRODUCTS_Of_2_Brands: [
    systemRoles.SUPER_ADMIN,
    systemRoles.ADMIN,
    systemRoles.USER,
  ],
}
