import { scheduleJob } from 'node-schedule'
import Coupon from '../../DB/Models/coupon.model.js'
// import moment from "moment";
import { DateTime } from 'luxon'
import orderModel from '../../DB/Models/order.model.js'

export function cronToChangeExpiredCoupons() {
  scheduleJob('* * 0 * * *', async () => {
    const coupons = await Coupon.find({ couponStatus: 'valid' })
    for (const coupon of coupons) {
      if (DateTime.fromISO(coupon.toDate) < DateTime.now()) {
        coupon.couponStatus = 'expired'
      }
      await coupon.save()
    }
  })
}

export function cronToDeleteOrdersOlderThanDay() {
  scheduleJob('* * 0 * * *', async () => {
    const dayInMS = 24 * 60 * 60 * 1000
    const orders = await orderModel.find({ orderStatus: 'Pending' })
    for (const order of orders) {
      // if the difference between now and the order createdAt more than day duration in ms
      // then cancel it
      // this operation runs automatically everyday at 12 am
      if (DateTime.now() - DateTime.fromISO(order.createdAt) >= dayInMS) {
        order.orderStatus = 'Cancelled'
        order.cancelledAt = DateTime.now().toISO()
      }
      await order.save()
    }
  })
}
