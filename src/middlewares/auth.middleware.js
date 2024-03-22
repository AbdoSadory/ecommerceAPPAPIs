import jwt from 'jsonwebtoken'
import User from '../../DB/Models/user.model.js'
export const auth = (accessRoles) => {
  return async (req, res, next) => {
    const { accesstoken } = req.headers
    if (!accesstoken)
      return next(new Error('please login first', { cause: 400 }))

    if (!accesstoken.startsWith(process.env.TOKEN_PREFIX))
      return next(new Error('invalid token prefix', { cause: 400 }))

    const token = accesstoken.split(process.env.TOKEN_PREFIX)[1]
    try {
      const decodedData = jwt.verify(token, process.env.JWT_SECRET_LOGIN)

      if (!decodedData || !decodedData.id)
        return next(new Error('invalid token payload', { cause: 400 }))

      // user check
      const findUser = await User.findById(
        decodedData.id,
        'username email role isDeleted'
      ) // loggdInUser ROle
      if (!findUser)
        return next(new Error('please signUp first', { cause: 404 }))

      if (findUser.isDeleted)
        return next(
          new Error('No user is existed with this token', { cause: 404 })
        )
      // auhtorization
      if (!accessRoles.includes(findUser.role))
        return next(new Error('unauthorized', { cause: 401 }))
      req.authUser = findUser
      next()
    } catch (error) {
      console.log(error)
      if (error.name === 'TokenExpiredError') {
        const findUserWithToken = await User.findOne({ token })
        if (!findUserWithToken)
          return next(
            new Error('No User with this token has been found', { cause: 404 })
          )
        const refreshedToken = jwt.sign(
          {
            email: findUserWithToken.email,
            id: findUserWithToken._id,
            loggedIn: true,
          },
          process.env.JWT_SECRET_LOGIN,
          { expiresIn: '3d' }
        )
        findUserWithToken.token = refreshedToken
        await findUserWithToken.save()
        return res.status(200).json({
          message: 'Token has been refreshed successfully',
          token: refreshedToken,
        })
      }

      next(new Error('catch error in auth middleware', { cause: 500 }))
    }
  }
}
