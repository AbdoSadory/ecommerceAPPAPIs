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

//=========================== For Testing The coupon ===========================//
export const validateCouponApi = async (req, res, next) => {
  const { code } = req.body
  const { _id: userId } = req.authUser

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

//================================= get disabled coupons ====================//
export const getDisabledCoupons = async (req, res, next) => {
  const disabledCoupons = await Coupon.find({ isEnabled: false })
  if (!disabledCoupons)
    return next(new Error('Error while getting disabled coupons '))

  res.status(200).json({ message: `Disabled Coupons`, disabledCoupons })
}

//================================= get enabled coupons ====================//
export const getEnabledCoupons = async (req, res, next) => {
  const enabledCoupons = await Coupon.find({ isEnabled: true })
  if (!enabledCoupons)
    return next(new Error('Error while getting enabled coupons '))

  res.status(200).json({ message: `Enabled Coupons`, enabledCoupons })
}

//================================= get coupon by id ====================//
export const getCouponById = async (req, res, next) => {
  const { couponId } = req.params
  const coupon = await Coupon.findById(couponId)
  if (!coupon) return next(new Error('no coupon with this id ', { cause: 404 }))

  res.status(200).json({ message: `Coupon ID : ${couponId}`, coupon })
}

//================================= update coupon ====================//
export const updateCoupon = async (req, res, next) => {
  // destruct couponId
  const { couponId } = req.params
  // destruct data from body
  const { couponCode, couponAmount, fromDate, toDate, isFixed, isPercentage } =
    req.body

  // destruct id of authenticated User
  const { _id } = req.authUser

  //check coupon if is existed
  const isCouponExisted = await Coupon.findById(couponId)
  if (!isCouponExisted)
    return next({
      message: "Coupon isn't existed with this id",
      cause: 404,
    })
  //check couponCode if is existed with another coupon
  if (couponCode) {
    // couponcode check
    const isCouponCodeExist = await Coupon.findOne({
      couponCode,
      _id: { $ne: couponId },
    })
    if (isCouponCodeExist)
      return next({
        message: 'Coupon code already exist with another coupon',
        cause: 409,
      })

    isCouponExisted.couponCode = couponCode
  }
  couponAmount && (isCouponExisted.couponAmount = couponAmount)
  fromDate && (isCouponExisted.fromDate = fromDate)
  toDate && (isCouponExisted.toDate = toDate)

  // check isFixed not equal undefined
  if (isFixed !== undefined) isCouponExisted.isFixed = isFixed

  // check isPercentage not equal undefined
  if (isPercentage !== undefined) {
    if (isCouponExisted.couponAmount > 100)
      return next({ message: 'Percentage should be less than 100', cause: 400 })

    isCouponExisted.isPercentage = isPercentage
  }

  isCouponExisted.updatedBy = _id

  // update
  const updatedCoupon = await isCouponExisted.save()
  res
    .status(200)
    .json({ message: 'Coupon has been updated successfully', updatedCoupon })
}

//================================= delete coupon ====================//
export const deleteCoupon = async (req, res, next) => {
  const { couponId } = req.params
  const { _id } = req.authUser
  const coupon = await Coupon.findOneAndUpdate(
    { _id: couponId, isDeleted: false },
    {
      $set: {
        isDeleted: true,
        deletedAt: DateTime.now().toISO(),
        deletedBy: _id,
        isEnabled: false,
        disabledAt: DateTime.now().toISO(),
        disabledBy: _id,
      },
      $unset: { enabledAt: DateTime.now().toISO(), enabledBy: _id },
    }
  )
  if (!coupon) return next(new Error('no coupon with this id ', { cause: 404 }))

  const couponUsers = await CouponUsers.updateMany(
    { couponId },
    {
      isDeleted: true,
      deletedAt: DateTime.now().toISO(),
      deletedBy: _id,
    }
  )

  if (!couponUsers.modifiedCount) {
    return next(new Error('No documents have been deleted in coupon Users'))
  }
  res
    .status(200)
    .json({ message: `Coupon ID : ${couponId} has been deleted successfully` })
}

//================================= change coupon activation ====================//
export const changeCouponActivation = async (req, res, next) => {
  const { couponId } = req.params
  const { isEnabled } = req.query
  const { _id } = req.authUser

  // parse the value of isEnabled
  const couponActivation = JSON.parse(isEnabled)

  //construct the query object to set and unset
  const query = { set: {}, unset: {} }

  query.set.isEnabled = couponActivation

  if (couponActivation === true) {
    query.set.enabledAt = DateTime.now().toISO()
    query.set.enabledBy = _id
    query.unset.disabledAt = 1
    query.unset.disabledBy = 1
  } else if (couponActivation === false) {
    query.set.disabledAt = DateTime.now().toISO()
    query.set.disabledBy = _id
    query.unset.enabledAt = 1
    query.unset.enabledBy = 1
  }

  //find and update
  const coupon = await Coupon.findOneAndUpdate(
    { _id: couponId, isDeleted: false },
    { $set: query.set, $unset: query.unset },
    { new: true }
  )

  if (!coupon) return next(new Error('Error while updating coupon activation '))

  res
    .status(200)
    .json({ message: `Coupon activation has been updated`, coupon })
}
