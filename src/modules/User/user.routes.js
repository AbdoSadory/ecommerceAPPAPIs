import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'
import * as userControllers from './user.controller.js'
import { auth } from '../../middlewares/auth.middleware.js'
import { endPointsRoles } from './user.endpoints.js'
import { validationMiddleware } from '../../middlewares/validation.middleware.js'
import {
  deleteUserSchema,
  getUserSchema,
  updateUserSchema,
} from './user.validationSchemas.js'
const router = Router()

router
  .route('/:userId')
  .get(
    auth(endPointsRoles.UPDATE_USER),
    validationMiddleware(getUserSchema),
    expressAsyncHandler(userControllers.getUserProfile)
  )
  .put(
    auth(endPointsRoles.UPDATE_USER),
    validationMiddleware(updateUserSchema),
    expressAsyncHandler(userControllers.updateUser)
  )
  .delete(
    auth(endPointsRoles.UPDATE_USER),
    validationMiddleware(deleteUserSchema),
    expressAsyncHandler(userControllers.deleteUser)
  )

export default router
