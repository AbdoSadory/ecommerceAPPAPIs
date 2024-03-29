import { gracefulShutdown } from 'node-schedule'
import db_connection from '../DB/connection.js'
import { globalResponse } from './middlewares/global-response.middleware.js'
import { rollbackSavedDocuments } from './middlewares/rollback-saved-documnets.middleware.js'
import { rollbackUploadedFiles } from './middlewares/rollback-uploaded-files.middleware.js'

import cors from 'cors'
import * as routers from './modules/index.routes.js'

import {
  cronToChangeExpiredCoupons,
  cronToDeleteOrdersOlderThanDay,
} from './utils/crons.js'

export const initiateApp = (app, express) => {
  const port = process.env.PORT

  app.use(express.json())

  db_connection()
  app.use(cors())
  app.get('/', (req, res) => {
    console.log('/')
    return res.json({ message: 'Hello E-Commerce!' })
  })
  app.use('/auth', routers.authRouter)
  app.use('/user', routers.userRouter)
  app.use('/category', routers.categoryRouter)
  app.use('/subCategory', routers.subCategoryRouter)
  app.use('/brand', routers.brandRouter)
  app.use('/product', routers.productRouter)
  app.use('/cart', routers.cartRouter)
  app.use('/coupon', routers.couponRouter)
  app.use('/order', routers.orderRouter)
  app.use('/review', routers.reviewRouter)

  app.use('*', (req, res) => {
    return res.json({ message: 'Invalid URL' })
  })
  app.use(globalResponse, rollbackUploadedFiles, rollbackSavedDocuments)

  cronToChangeExpiredCoupons()
  cronToDeleteOrdersOlderThanDay()
  app.listen(port, () =>
    console.log(`Server is listening on port ${port}! 🔥🔥🔥`)
  )
}
