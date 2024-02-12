import { Router } from 'express'
const router = Router()
import * as subCategoryController from './subCategory.controller.js'
import expressAsyncHandler from 'express-async-handler'
import { multerMiddleHost } from '../../middlewares/multer.js'
import { endPointsRoles } from './subCategory.endpoints.js'
import { auth } from '../../middlewares/auth.middleware.js'
import { allowedExtensions } from '../../utils/allowed-extensions.js'
import { validationMiddleware } from '../../middlewares/validation.middleware.js'
import * as subCategorySchemas from './subCategory.validationSchemas.js'

router.post(
  '/:categoryId',
  auth(endPointsRoles.ADD_SUB_CATEGORY),
  multerMiddleHost({
    extensions: allowedExtensions.image,
  }).single('image'),
  expressAsyncHandler(subCategoryController.addSubCategory)
)

router.get(
  '/',
  auth(endPointsRoles.ALL_SUB_CATEGORIES_WITH_BRANDS),
  expressAsyncHandler(subCategoryController.allSubCategoriesWithBrands)
)

router.put(
  '/:subCategoryId',
  auth(endPointsRoles.UPDATE_SUB_CATEGORY),
  multerMiddleHost({ extensions: allowedExtensions.image }).single('image'),
  validationMiddleware(subCategorySchemas.updateSubCategorySchema),
  expressAsyncHandler(subCategoryController.updateSubCategory)
)

router.delete(
  '/:subCategoryId',
  auth(endPointsRoles.DELETE_SUB_CATEGORY),
  validationMiddleware(subCategorySchemas.deleteSubCategorySchema),
  expressAsyncHandler(subCategoryController.deleteSubCategory)
)
export default router
