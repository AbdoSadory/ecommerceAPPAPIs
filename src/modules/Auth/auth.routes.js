import { Router } from 'express'
import * as authController from './auth.controller.js'
import expressAsyncHandler from 'express-async-handler'
import { validationMiddleware } from '../../middlewares/validation.middleware.js'
import { signUpSchema } from './auth.validationSchemas.js'
const router = Router()

router.post(
  '/',
  validationMiddleware(signUpSchema),
  expressAsyncHandler(authController.signUp)
)
router.get('/verify-email', expressAsyncHandler(authController.verifyEmail))

router.post('/login', expressAsyncHandler(authController.signIn))

export default router
