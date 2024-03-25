import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../../../DB/Models/user.model.js'
import sendEmailService from '../../services/send-email.service.js'
import generateUniqueString from '../../utils/generate-Unique-String.js'
import OTP from '../../../DB/Models/OTP.model.js'

// ========================================= SignUp API ================================//

/**
 * destructuring the required data from the request body
 * check if the user already exists in the database using the email
 * if exists return error email is already exists
 * password hashing
 * create new document in the database
 * return the response
 */
export const signUp = async (req, res, next) => {
  // 1- destructure the required data from the request body
  const { username, email, password, age, role, phoneNumbers, addresses } =
    req.body

  // 2- check if the user already exists in the database using the email
  const isEmailDuplicated = await User.findOne({ email })
  if (isEmailDuplicated) {
    return next(
      new Error('Email already exists,Please try another email', { cause: 409 })
    )
  }
  // 3- send confirmation email to the user
  const usertoken = jwt.sign({ email }, process.env.JWT_SECRET_VERFICATION, {
    expiresIn: '2m',
  })

  const isEmailSent = await sendEmailService({
    to: email,
    subject: 'Email Verification',
    message: `
        <h2>please clich on this link to verfiy your email</h2>
        <a href="http://localhost:3000/auth/verify-email?token=${usertoken}">Verify Email</a>
        `,
  })
  // 4- check if email is sent successfully
  if (!isEmailSent) {
    return next(
      new Error('Email is not sent, please try again later', { cause: 500 })
    )
  }
  // 5- password hashing
  const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)

  // 6- create new document in the database
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    age,
    role,
    phoneNumbers,
    addresses,
  })
  req.savedDocuments = { model: User, _id: newUser._id }
  // 7- return the response
  res.status(201).json({
    success: true,
    message:
      'User created successfully, please check your email to verify your account',
    data: newUser,
  })
}

/**
 * Twilio => paid service
 * nodemailer => free service
 */

// ========================================= Verify Email API ================================//
/**
 * destructuring token from the request query
 * verify the token
 * get user by email , isEmailVerified = false
 * if not return error user not found
 * if found
 * update isEmailVerified = true
 * return the response
 */
export const verifyEmail = async (req, res, next) => {
  const { token } = req.query
  const decodedData = jwt.verify(token, process.env.JWT_SECRET_VERFICATION)

  if (!decodedData || !decodedData.email)
    return next(new Error('invalid token payload', { cause: 400 }))

  // get uset by email , isEmailVerified = false
  const user = await User.findOneAndUpdate(
    {
      email: decodedData.email,
      isEmailVerified: false,
    },
    { isEmailVerified: true },
    { new: true }
  )
  if (!user) {
    return next(new Error("User hasn't been found", { cause: 404 }))
  }

  res.status(200).json({
    success: true,
    message: 'Email verified successfully, please try to login',
  })
}

// ========================================= SignIn API ================================//

/**
 * destructuring the required data from the request body
 * get user by email and check if isEmailVerified = true
 * if not return error invalid login credentails
 * if found
 * check password
 * if not return error invalid login credentails
 * if found
 * generate login token
 * updated isLoggedIn = true  in database
 * return the response
 */

export const signIn = async (req, res, next) => {
  const { email, password } = req.body
  // get user by email
  const user = await User.findOne({
    email,
    isEmailVerified: true,
    isDeleted: false,
  })
  if (!user) {
    return next(
      new Error("Invalid login credentails or email isn't verified", {
        cause: 404,
      })
    )
  }
  // check password
  const isPasswordValid = bcrypt.compareSync(password, user.password)
  if (!isPasswordValid) {
    return next(new Error('Invalid login credentails', { cause: 404 }))
  }

  // generate login token
  const token = jwt.sign(
    { email, id: user._id, loggedIn: true },
    process.env.JWT_SECRET_LOGIN,
    { expiresIn: '1d' }
  )
  // updated isLoggedIn = true  in database

  user.isLoggedIn = true
  user.token = token
  await user.save()

  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    data: {
      token,
    },
  })
}

/**
 * Check if user in DB using email
 * create unique random otp (length=6)
 * Hashing the otp
 * check if user gets otp doc in db
 * if TRUE, update it with new hashed OTP
 * if FALSE, in case it's first time to forget password , create OTP document with email and hashed OTP code
 * send OTP through email
 */
export const forgetPassword = async (req, res, next) => {
  const { email } = req.body
  // Check if user in DB using email
  const isUserExisted = await User.findOne({ email, isDeleted: false })

  if (!isUserExisted) {
    return next(
      new Error('No User with this email has been found', { cause: 404 })
    )
  }
  // create unique random otp (length=6)
  const otp = generateUniqueString(6)
  // Hashing the otp
  const hashedOTP = bcrypt.hashSync(otp, parseInt(process.env.SALT_ROUNDS))
  const hashedOTPToBeSent = jwt.sign(otp, process.env.JWT_OTP)

  // check if user gets otp doc in db
  // if TRUE, update it with new hashed OTP
  // if FALSE, in case it's first time to forget password , create OTP document with email and hashed OTP code
  const isOTPDocExisted = await OTP.findOne({ email })

  if (isOTPDocExisted) {
    isOTPDocExisted.otp = hashedOTP
    const updatedOTP = await isOTPDocExisted.save()
    if (!updatedOTP) {
      return next(
        new Error('Error while updating OTP with new one, please try again')
      )
    }
  } else {
    const newOTP = await OTP.create({
      email,
      otp: hashedOTP,
    })
    if (!newOTP) {
      return next(new Error('Error while creating OTP, please try again'))
    }
  }
  // send OTP through email
  const isEmailSent = await sendEmailService({
    to: email,
    subject: 'OTP Reset Password',
    message: `
        <h1>please send this otp with your email and new password to reset your password</h1>
        <p>OTP: ${hashedOTPToBeSent}</p>
        `,
  })
  if (!isEmailSent) {
    return next(new Error('Email is not sent, please try again later'))
  }

  res.status(200).json({
    message: 'Please check your email inbox and send us the otp',
  })
}

/**
 * Verify the Email user if it's existed in OTP collection
 * check the OTP if it's not used before
 * Decrypt the recieved OTP
 * compare OTP for authentication case
 * hashing the new password
 * Get the user and update password with the new one
 * send back the user data
 */
export const getOTPandNewPassword = async (req, res, next) => {
  const { otp, email, newPassword } = req.body
  // Verify the Email user if it's existed in OTP collection
  const isEmailExistedOTP = await OTP.findOne({ email })
  if (!isEmailExistedOTP) {
    return next(new Error('Invalid Email, Please try again', { cause: 401 }))
  }
  // check the OTP if it's not used before
  if (isEmailExistedOTP.isUsed) {
    return next(
      new Error('This OTP has been used before, Please try again', {
        cause: 401,
      })
    )
  }

  // Decrypt the recieved OTP
  const decryptedOTP = jwt.verify(otp, process.env.JWT_OTP)

  // compare OTP for authentication case
  const isOTPRight = bcrypt.compareSync(decryptedOTP, isEmailExistedOTP.otp)
  if (!isOTPRight)
    return next(
      new Error('Invalid OTP, Please try again', {
        cause: 401,
      })
    )
  // hashing the new password
  const hashingNewPassword = bcrypt.hashSync(
    newPassword,
    parseInt(process.env.SALT_ROUNDS)
  )
  // Get the user and update password with the new one
  const getUser = await User.findOne({
    email,
    isDeleted: false,
  })
  if (!getUser)
    return next(new Error('No User with this Email', { cause: 404 }))

  getUser.password = hashingNewPassword
  await getUser.save()
  isEmailExistedOTP.isUsed = true
  await isEmailExistedOTP.save()
  // send back the user data
  res
    .status(200)
    .json({ message: 'reset password successfully', user: getUser })
}
