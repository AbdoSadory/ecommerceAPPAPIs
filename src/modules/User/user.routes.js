import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'
import * as userControllers from './user.controller.js'
import { auth } from '../../middlewares/auth.middleware.js'
import { endPointsRoles } from './user.endpoints.js'
import { validationMiddleware } from '../../middlewares/validation.middleware.js'
import { getUserSchema, updateUserSchema } from './user.validationSchemas.js'
const router = Router()

router
  .route('/:userId')
  .get(
    auth(endPointsRoles.GET_USER_PROFILE),
    validationMiddleware(getUserSchema),
    expressAsyncHandler(userControllers.getUserProfile)
  )

router
  .route('/')
  .put(
    auth(endPointsRoles.UPDATE_USER),
    validationMiddleware(updateUserSchema),
    expressAsyncHandler(userControllers.updateUser)
  )
  .delete(
    auth(endPointsRoles.DELETE_USER),
    expressAsyncHandler(userControllers.deleteUser)
  )

export default router
