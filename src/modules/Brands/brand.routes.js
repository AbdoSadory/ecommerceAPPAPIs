import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'

import * as brandController from './brand.controller.js'
import { multerMiddleHost } from '../../middlewares/multer.js'
import { allowedExtensions } from '../../utils/allowed-extensions.js'
import { endPointsRoles } from './brand.endpoints.js'
import { auth } from '../../middlewares/auth.middleware.js'
import { validationMiddleware } from '../../middlewares/validation.middleware.js'
import * as brandValidationSchemas from './brand.validationSchemas.js'
const router = Router()

router.get(
  '/',
  auth(endPointsRoles.GET_ALL_BRAND),
  expressAsyncHandler(brandController.getAllBrands)
)
router.get(
  '/categoryBrands',
  auth(endPointsRoles.GET_CATEGORY_BRANDS),
  validationMiddleware(brandValidationSchemas.getBrandsByCategory),
  expressAsyncHandler(brandController.getBrandsByCategory)
)
router.get(
  '/subCategoryBrands',
  auth(endPointsRoles.GET_SUB_CATEGORY_BRANDS),
  validationMiddleware(brandValidationSchemas.getBrandsBySubCategory),
  expressAsyncHandler(brandController.getBrandsBySubCategory)
)
router.get(
  '/paginatedBrands',
  validationMiddleware(brandValidationSchemas.allBrandsPaginatedSchema),
  expressAsyncHandler(brandController.getAllBrandsPaginated)
)
router.get(
  '/filteredBrands',
  expressAsyncHandler(brandController.getAllBrandsFiltered)
)
router.post(
  '/',
  auth(endPointsRoles.ADD_BRAND),
  multerMiddleHost({
    extensions: allowedExtensions.image,
  }).single('image'),
  expressAsyncHandler(brandController.addBrand)
)

router
  .route('/:brandId')
  .put(
    auth(endPointsRoles.UPDATE_BRAND),
    multerMiddleHost({
      extensions: allowedExtensions.image,
    }).single('image'),
    validationMiddleware(brandValidationSchemas.updateBrandSchema),
    expressAsyncHandler(brandController.updateBrand)
  )
  .delete(
    auth(endPointsRoles.DELETE_BRAND),
    validationMiddleware(brandValidationSchemas.deleteBrandSchema),
    expressAsyncHandler(brandController.deleteBrand)
  )
export default router
