import Coupon from '../../../DB/Models/coupon.model.js'
import CouponUsers from '../../../DB/Models/coupon-users.model.js'
import User from '../../../DB/Models/user.model.js'
import { applyCouponValidation } from '../../utils/coupon.validation.js'
import { APIFeatures } from '../../utils/api-features.js'
import { DateTime } from 'luxon'

//============================== Add Coupon API ==============================//
/**
 * @param {*} req.body  { couponCode , couponAmount , fromDate, toDate , isFixed , isPercentage, Users}
 * @param {*} req.authUser  { _id:userId}
 * @returns  {message: "Coupon added successfully",coupon, couponUsers}
 * @description create coupon and couponUsers
 */
export const addCoupon = async (req, res, next) => {
  const {
    couponCode,
    couponAmount,
    fromDate,
    toDate,
    isFixed,
    isPercentage,
    Users, // [{userId, maxUsage},{userId,maxUsage}]  => [{userId, maxUsage, couponId}]
  } = req.body

  const { _id: addedBy } = req.authUser

  // couponcode check
  const isCouponCodeExist = await Coupon.findOne({ couponCode })
  if (isCouponCodeExist)
    return next({ message: 'Coupon code already exist', cause: 409 })

  if (isFixed == isPercentage)
    return next({
      message: 'Coupon can be either fixed or percentage',
      cause: 400,
    })

  if (isPercentage) {
    if (couponAmount > 100)
      return next({ message: 'Percentage should be less than 100', cause: 400 })
  }
  const couponObject = {
    couponCode,
    couponAmount,
    fromDate,
    toDate,
    isFixed,
    isPercentage,
    addedBy,
    enabledAt: DateTime.now().toISO(),
    enabledBy: addedBy,
  }
  const coupon = await Coupon.create(couponObject)

  const userIds = []
  let couponUsers

  if (Users?.length) {
    for (const user of Users) {
      userIds.push(user.userId)
    }
    const isUserExist = await User.find({ _id: { $in: userIds } })
    if (isUserExist.length != Users.length)
      return next({
        message: 'User is not found or duplicated in incoming data',
        cause: 404,
      })

    couponUsers = await CouponUsers.create(
      Users.map((ele) => ({ ...ele, couponId: coupon._id }))
    )
  }

  res
    .status(201)
    .json({ message: 'Coupon added successfully', coupon, couponUsers })
}

/**
 * Anotehr APIs from coupon module
 * getAllCoupons
 * getCouponByCode
 * updateCoupon  , set the loggedInUserId as updatedBy
 * deleteCoupon
 */

//=========================== For Testing ===========================//
export const validateCouponApi = async (req, res, next) => {
  const { code } = req.body
  const { _id: userId } = req.authUser // const userId  = req.authUser._id

  // applyCouponValidation
  const isCouponValid = await applyCouponValidation(code, userId)
  if (isCouponValid.status) {
    return next({ message: isCouponValid.message, cause: isCouponValid.status })
  }

  res.json({ message: 'coupon is valid', coupon: isCouponValid })
}

//================================= get all coupons paginated ====================//
export const getAllCouponsPaginated = async (req, res, next) => {
  // destruct the page number from query
  const { page } = req.query
  // we set the size of coupons per page because we know our data 🔥
  const size = 2
  // we get total pages number to be sent in response to client
  const pages = Math.ceil((await Coupon.find().countDocuments()) / size)

  const paginationFeature = new APIFeatures(Coupon.find()).pagination({
    page,
    size,
  })

  const coupons = await paginationFeature.mongooseQuery
  if (!coupons)
    return next(new Error('Error while getting coupons from search method'))

  res.status(200).json({ message: `Coupons`, pages, page: +page, coupons })
}

//================================= get all coupons filtered ====================//
export const getAllCouponsFiltered = async (req, res, next) => {
  const { ...filter } = req.query

  const filteredFeature = new APIFeatures(Coupon.find()).filters(filter)

  const coupons = await filteredFeature.mongooseQuery
  if (!coupons)
    return next(new Error('Error while getting coupons from filter method'))

  res.status(200).json({ message: `Coupons`, coupons })
}
