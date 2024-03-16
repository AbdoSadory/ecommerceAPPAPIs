import bcrypt from 'bcrypt'
import User from '../../../DB/Models/user.model.js'
import jwt from 'jsonwebtoken'
import sendEmailService from '../../services/send-email.service.js'
import { DateTime } from 'luxon'
import brandModel from '../../../DB/Models/brand.model.js'
import cartModel from '../../../DB/Models/cart.model.js'
import categoryModel from '../../../DB/Models/category.model.js'
import couponUsersModel from '../../../DB/Models/coupon-users.model.js'
import couponModel from '../../../DB/Models/coupon.model.js'
import orderModel from '../../../DB/Models/order.model.js'
import productModel from '../../../DB/Models/product.model.js'
import subCategoryModel from '../../../DB/Models/sub-category.model.js'
/**
 * check if user is existed
 * check if it's verified
 * check if new email is already used for another user
 * send Verification Email again to verify the new email
 * if password is send, hash Password and save it
 * update any field has been sent
 * update
 */
export const updateUser = async (req, res, next) => {
  const { username, email, password, age, role, phoneNumbers, addresses } =
    req.body
  const { id: userId } = req.authUser
  // check if user is existed
  const user = await User.findById(userId)
  if (!user) {
    return next(new Error('No User with this id', { cause: 404 }))
  }
  // check if it's verified
  if (!user.isEmailVerified) {
    return next(
      new Error('You have to verified your account first', { cause: 403 })
    )
  }
  if (email) {
    // check if new email is already used for another user
    const isEmailExisted = await User.findOne({ _id: { $ne: userId }, email })
    if (isEmailExisted)
      return next(
        new Error(
          'This Email is already existed for another user, try another one',
          { cause: 409 }
        )
      )

    // create token of this email for verification
    const usertoken = jwt.sign({ email }, process.env.JWT_SECRET_VERFICATION, {
      expiresIn: '2m',
    })

    // send verification email
    const isEmailSent = await sendEmailService({
      to: email,
      subject: 'Email Verification',
      message: `
          <h2>please clich on this link to verfiy your email</h2>
          <a href="http://localhost:3000/auth/verify-email?token=${usertoken}">Verify Email</a>
          `,
    })
    if (!isEmailSent) {
      return next(new Error('Email is not sent, please try again later'))
    }

    user.email = email
    user.isEmailVerified = false
  }

  // if password is sent, hash Password and save it
  if (password) {
    const hashedNewPassword = bcrypt.hashSync(
      password,
      +process.env.SALT_ROUNDS
    )
    user.password = hashedNewPassword
  }
  username && (user.username = username)
  age && (user.age = age)
  role && (user.role = role)
  phoneNumbers?.length && (user.phoneNumbers = phoneNumbers)
  addresses?.length && (user.addresses = addresses)
  user['__v'] += 1

  const updatedUser = await user.save()
  res
    .status(200)
    .json({ message: 'User has been updated successfully', updatedUser })
}

/**
 * check if user is existed
 * update the account if it's existed with isDeleted and deletedAt
 */
export const deleteUser = async (req, res, next) => {
  const { id: userId } = req.authUser
  // check if user is existed
  const user = await User.findOne({ _id: userId, isDeleted: false })
  if (!user) {
    return next(new Error('No User with this id', { cause: 404 }))
  }
  // check if it's verified
  if (!user.isEmailVerified) {
    return next(
      new Error('You have to verified your account first', { cause: 403 })
    )
  }
  // hard deletion of the account if it's existed
  //  const deletedUser = await User.findByIdAndDelete(userId)
  //  if (!deletedUser)
  //   return next(new Error(`There's no user with this id`, { cause: 400 }))

  // soft deletion of the account if it's existed
  user.isDeleted = true
  user.deletedAt = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')

  const deletedUser = await user.save()
  if (!deletedUser) return next(new Error(`Error while deleting the user`))

  // soft deletion of all records attached to this user
  await brandModel.updateMany(
    { addedBy: userId },
    {
      isDeleted: true,
      deletedAt: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
      deletedBy: userId,
    }
  )
  await cartModel.updateMany(
    { addedBy: userId },
    {
      isDeleted: true,
      deletedAt: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
      deletedBy: userId,
    }
  )
  await categoryModel.updateMany(
    { addedBy: userId },
    {
      isDeleted: true,
      deletedAt: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
      deletedBy: userId,
    }
  )
  await subCategoryModel.updateMany(
    { addedBy: userId },
    {
      isDeleted: true,
      deletedAt: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
      deletedBy: userId,
    }
  )
  await couponUsersModel.updateMany(
    { addedBy: userId },
    {
      isDeleted: true,
      deletedAt: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
      deletedBy: userId,
    }
  )
  await couponModel.updateMany(
    { addedBy: userId },
    {
      isDeleted: true,
      deletedAt: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
      deletedBy: userId,
    }
  )
  await orderModel.updateMany(
    { addedBy: userId },
    {
      isDeleted: true,
      deletedAt: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
      deletedBy: userId,
    }
  )
  await productModel.updateMany(
    { addedBy: userId },
    {
      isDeleted: true,
      deletedAt: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
      deletedBy: userId,
    }
  )
  res
    .status(200)
    .json({ message: 'User has been deleted successfully', deletedUser })
}

export const getUserProfile = async (req, res, next) => {
  const { userId } = req.params
  // check if user is existed
  const user = await User.findById(userId)
  if (!user) {
    return next(new Error('No User with this id', { cause: 404 }))
  }

  res.status(200).json({ message: 'User', user })
}
