import bcrypt from 'bcrypt'
import User from '../../../DB/Models/user.model.js'

/**
 * check if user is existed
 * check if it's verified
 * check if new email is already used for another user
 * if password is send, hash Password and save it
 * update
 */
export const updateUser = async (req, res, next) => {
  const { userId } = req.params
  const { username, email, password, age, role, phoneNumbers, addresses } =
    req.body

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
  // check if new email is already used for another user
  if (email) {
    const isEmailExisted = await User.findOne({ email })
    if (isEmailExisted && isEmailExisted._id.toString() !== userId)
      return next(
        new Error(
          'This Email is already existed for another user, try another one',
          { cause: 400 }
        )
      )

    user.email = email
  }

  // if password is send, hash Password and save it
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
  phoneNumbers.length && (user.phoneNumbers = phoneNumbers)
  addresses.length && (user.addresses = addresses)

  const updatedUser = await user.save()
  res
    .status(200)
    .json({ message: 'User has been updated successfully', updatedUser })
}

/**
 * check if user is existed
 * delete the account if it's existed
 */
export const deleteUser = async (req, res, next) => {
  const { userId } = req.params
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
  // delete the account if it's existed
  const deletedUser = await User.findByIdAndDelete(userId)
  if (!deletedUser)
    return next(new Error(`There's no user with this id`, { cause: 400 }))
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
