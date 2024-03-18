import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'
import * as userControllers from './user.controller.js'
import { auth } from '../../middlewares/auth.middleware.js'
import { endPointsRoles } from './user.endpoints.js'
import { validationMiddleware } from '../../middlewares/validation.middleware.js'
import * as userSchemas from './user.validationSchemas.js'
const router = Router()

router
  .route('/profile/:userId')
  .get(
    auth(endPointsRoles.GET_USER_PROFILE),
    validationMiddleware(userSchemas.getUserSchema),
    expressAsyncHandler(userControllers.getUserProfile)
  )
router
  .route('/myProfile')
  .get(
    auth(endPointsRoles.GET_MY_PROFILE),
    expressAsyncHandler(userControllers.getUserPrivateProfile)
  )

router
  .route('/')
  .put(
    auth(endPointsRoles.UPDATE_USER),
    validationMiddleware(userSchemas.updateUserSchema),
    expressAsyncHandler(userControllers.updateUser)
  )
  .delete(
    auth(endPointsRoles.DELETE_USER),
    expressAsyncHandler(userControllers.deleteUser)
  )

router.put(
  '/updatePassword',
  auth(endPointsRoles.UPDATE_PASSWORD_USER),
  validationMiddleware(userSchemas.updatePasswordSchema),
  expressAsyncHandler(userControllers.updatePassword)
)
export default router
