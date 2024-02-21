import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'

import * as productController from './product.controller.js'
import { auth } from '../../middlewares/auth.middleware.js'
import { multerMiddleHost } from '../../middlewares/multer.js'
import { allowedExtensions } from '../../utils/allowed-extensions.js'
import { endPointsRoles } from './product.endpoints.js'
import { validationMiddleware } from '../../middlewares/validation.middleware.js'
import * as productValidationSchemas from './product.validationSchemas.js'
const router = Router()

router.post(
  '/',
  auth(endPointsRoles.ADD_PRODUCT),
  multerMiddleHost({ extensions: allowedExtensions.image }).array('image', 3),
  expressAsyncHandler(productController.addProduct)
)

router.put(
  '/:productId',
  auth(endPointsRoles.UPDATE_PRODUCT),
  multerMiddleHost({ extensions: allowedExtensions.image }).single('image'),
  validationMiddleware(productValidationSchemas.updateProductSchema),
  expressAsyncHandler(productController.updateProduct)
)
router.delete(
  '/deleteProductById/:productId',
  auth(endPointsRoles.DELETE_PRODUCT),
  validationMiddleware(productValidationSchemas.deleteProductSchema),
  expressAsyncHandler(productController.deleteProduct)
)
router.get(
  '/getProductById/:productId',
  auth(endPointsRoles.GET_PRODUCT_By_ID),
  validationMiddleware(productValidationSchemas.getProductByIdSchema),
  expressAsyncHandler(productController.getProductById)
)
router.get(
  '/search',
  auth(endPointsRoles.SEARCH_ON_PRODUCT),
  validationMiddleware(productValidationSchemas.searchProductSchema),
  expressAsyncHandler(productController.searchOnProducts)
)

router.get(
  '/all',
  auth(endPointsRoles.ALL_PRODUCTS),
  validationMiddleware(productValidationSchemas.allProductsPaginatedSchema),
  expressAsyncHandler(productController.getAllProductsPaginated)
)
router.get(
  '/allProductsOfTwoBrands',
  auth(endPointsRoles.ALL_PRODUCTS_Of_2_Brands),
  expressAsyncHandler(productController.getAllProductsOfTwoBrands)
)

router.delete(
  '/productsByBrandId',
  auth(endPointsRoles.DELETE_PRODUCTS_BY_BRAND_ID),
  validationMiddleware(productValidationSchemas.deleteProductsByBrandIdSchema),
  expressAsyncHandler(productController.deleteManyProductsByBrandId)
)

export default router
