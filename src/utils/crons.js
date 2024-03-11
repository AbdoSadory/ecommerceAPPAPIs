import { scheduleJob } from 'node-schedule'
import Coupon from '../../DB/Models/coupon.model.js'
// import moment from "moment";
import { DateTime } from 'luxon'

export function cronToChangeExpiredCoupons() {
  scheduleJob('30 * * * * *', async () => {
    const coupons = await Coupon.find({ couponStatus: 'valid' })
    for (const coupon of coupons) {
      if (DateTime.fromISO(coupon.toDate) < DateTime.now()) {
        coupon.couponStatus = 'expired'
      }
      await coupon.save()
    }
  })
}

export function cronToChangeExpiredCouponsV1() {
  scheduleJob('*/5 * * * * *', async () => {
    console.log('cronToChangeExpiredCoupons()  is running every 5 seconds V1')
  })
}
export function cronToChangeExpiredCouponsV2() {
  scheduleJob('*/5 * * * * *', async () => {
    console.log('cronToChangeExpiredCoupons()  is running every 5 seconds V2')
  })
}
export function cronToChangeExpiredCouponsV3() {
  scheduleJob('40 * * * * *', async () => {
    console.log('cronToChangeExpiredCoupons()  is running every 5 seconds V3')
  })
}
