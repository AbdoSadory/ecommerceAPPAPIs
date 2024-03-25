# E-commerce App

A E-commerce App, using NodeJS runtime environment and ExpressJS as the server framework.

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the API](#running-the-api)
- [File Structure](#file-structure)
- [Endpoints](#endpoints)

## Prerequisites

Before you run the API, make sure you have the following prerequisites installed:

**MongoDB Server:** Ensure you have MongoDB Server installed. You can download and install MongoDB from [MongoDB official website](https://www.mongodb.com/try/download/community).

## Installation

To install dependencies:

```bash
npm install
```

## Running the API

To run in dev mode:

```bash
npm run dev
```

## File Structure

Following ExpressJS Structure:

- DB : for DB connection and Entities Schemas
- Src : for middlewares, modules (controllers,routes) , utils

```
  ├── config
  |   └── dev.config.env
  ├── DB
  |   ├── Models
  |   |      ├── brand.model.js
  |   |      ├── cart.model.js
  |   |      ├── category.model.js
  |   |      ├── coupon-user.model.js
  |   |      ├── coupon.model.js
  |   |      ├── order.model.js
  |   |      ├── OTP.model.js
  |   |      ├── product.model.js
  |   |      ├── review.model.js
  |   |      ├── sub-category.model.js
  |   |      └── user.model.js
  |   └── connection.js
  ├── Files
  ├── src
  |   ├── middlewares
  |   |      ├── auth-middlewares.js
  |   |      ├── global-response.middleware.js
  |   |      ├── multer.js
  |   |      ├── rollback-saved-documnets.middleware.js
  |   |      ├── rollback-uploaded-files.middleware.js
  |   |      └── validation.middleware.js
  │   ├── modules
  |   |      ├── Auth
  |   |      |      ├── auth.controller.js
  |   |      |      ├── auth.validationSchema.js
  |   |      |      └── auth.routes.js
  |   |      ├── Brands
  |   |      |      ├── brand.controller.js
  |   |      |      ├── brand.validationSchema.js
  |   |      |      ├── brand.endpoints.js
  |   |      |      └── brand.routes.js
  |   |      ├── Cart
  |   |      |      ├── utils
  |   |      |      |     ├── add-cart.js
  |   |      |      |     ├── add-product-to-cart.js
  |   |      |      |     ├── calculate-subtotal.js
  |   |      |      |     ├── check-product-in-cart.js
  |   |      |      |     ├── check-product-in-db.js
  |   |      |      |     ├── get-user-cart.js
  |   |      |      |     └── update-product-quantity.js
  |   |      |      ├── cart.controller.js
  |   |      |      ├── cart.validationSchema.js
  |   |      |      └── cart.routes.js
  |   |      ├── Category
  |   |      |      ├── category.controller.js
  |   |      |      ├── category.validationSchema.js
  |   |      |      ├── category.endpoints.js
  |   |      |      └── category.routes.js
  |   |      ├── Coupon
  |   |      |      ├── coupon.controller.js
  |   |      |      ├── coupon.validationSchema.js
  |   |      |      ├── coupon.endpoints.js
  |   |      |      └── coupon.routes.js
  |   |      ├── Order
  |   |      |      ├── order.controller.js
  |   |      |      ├── order.validationSchema.js
  |   |      |      ├── order.endpoints.js
  |   |      |      └── order.routes.js
  |   |      ├── Product
  |   |      |      ├── product.controller.js
  |   |      |      ├── product.validationSchema.js
  |   |      |      ├── product.endpoints.js
  |   |      |      └── product.routes.js
  |   |      ├── Review
  |   |      |      ├── review.controller.js
  |   |      |      ├── review.validationSchema.js
  |   |      |      ├── review.endpoints.js
  |   |      |      └── review.routes.js
  |   |      ├── Sub-categories
  |   |      |      ├── subCategory.controller.js
  |   |      |      ├── subCategory.validationSchema.js
  |   |      |      ├── subCategory.endpoints.js
  |   |      |      └── subCategory.routes.js
  |   |      ├── User
  |   |      |      ├── user.controller.js
  |   |      |      ├── user.validationSchema.js
  |   |      |      ├── user.endpoints.js
  |   |      |      └── user.routes.js
  |   |      └── index.routes.js
  │   ├── payment-handler
  |   |      └── stripe.js
  │   ├── services
  |   |      └── send-email.service.js
  |   ├── utils
  |   |      ├── allowed-extensions.js
  |   |      ├── api-features.js
  |   |      ├── cloudinary.js
  |   |      ├── coupon-validation.js
  |   |      ├── crons.js
  |   |      ├── general.validation.rule.js
  |   |      ├── generate-unique-string.js
  |   |      ├── pagination.js
  |   |      ├── pdfkit.js
  |   |      ├── qr-code.js
  |   |      └── system-roles.js
  |   └── initiate-app.js
  ├── index.js
  ├── README.md
  └── .gitignore
```

## Endpoints

### Check APIs Documentation : https://documenter.getpostman.com/view/27228437/2sA35D4NM6

### Auth

| Method | URL                    | Description                            |
| ------ | ---------------------- | -------------------------------------- |
| POST   | `/auth/`               | Create new user account                |
| POST   | `/auth/login`          | Authenticate and get access token      |
| POST   | `/auth/forgetPassword` | Forget Password                        |
| POST   | `/auth/resetPassword`  | Change password with new one using OTP |

### Brands

| Method | URL                        | Description                             |
| ------ | -------------------------- | --------------------------------------- |
| POST   | `/brand/`                  | Create a new brand                      |
| GET    | `/brand/`                  | Get all brands                          |
| GET    | `/brand/categoryBrands`    | Get all brands of specific category     |
| GET    | `/brand/subCategoryBrands` | Get all brands of specific sub-category |
| GET    | `/brand/paginatedBrands`   | Get all brands paginated                |
| GET    | `/brand/filteredBrands`    | Apply Filter on brands                  |
| PUT    | `/brand/:brandId`          | Update brand                            |
| DELETE | `/brand/:brandId`          | Delete brand                            |

### Cart

| Method | URL                | Description               |
| ------ | ------------------ | ------------------------- |
| POST   | `/cart/`           | Add a new product to cart |
| PUT    | `/cart/:productId` | Remove Product From Cart  |

### Category

| Method | URL                             | Description                  |
| ------ | ------------------------------- | ---------------------------- |
| POST   | `/category/`                    | Create a new category        |
| PUT    | `/category/:categoryId`         | Update category              |
| DELETE | `/category/:categoryId`         | Delete category              |
| GET    | `/category/:categoryId`         | Get one category             |
| GET    | `/category/paginatedCategories` | Get all categories paginated |
| GET    | `/category/filteredCategories`  | Apply Filter on categories   |
| GET    | `/category/`                    | Get all categories           |

### Coupon

| Method | URL                                        | Description                     |
| ------ | ------------------------------------------ | ------------------------------- |
| POST   | `/coupon/`                                 | Create a new coupon             |
| POST   | `/coupon/valid`                            | Checking The validity of coupon |
| GET    | `/coupon/paginatedCoupons`                 | Get all coupons paginated       |
| GET    | `/coupon/filteredCoupons`                  | Apply Filter on coupons         |
| GET    | `/coupon/disabledCoupons`                  | Get all disabled coupons        |
| GET    | `/coupon/enabledCoupons`                   | Get all enabled coupons         |
| GET    | `/coupon/operation/:couponId`              | Get coupon by id                |
| PUT    | `/coupon/operation/:couponId`              | Update coupon                   |
| DELETE | `/coupon/operation/:couponId`              | Delete coupon                   |
| PUT    | `/coupon/changeCouponActivation/:couponId` | Enable and Disable coupon       |

### Order

| Method | URL                         | Description                   |
| ------ | --------------------------- | ----------------------------- |
| POST   | `/order/`                   | Add order with one product    |
| POST   | `/order/cartToOrder`        | Add order with the whole cart |
| POST   | `/order/stripePay/:orderId` | Pay with Stripe               |
| POST   | `/order/refund/:orderId`    | Refund Order payment amount   |
| PUT    | `/order/:orderId`           | Deliver Order                 |

### Product

| Method | URL                                     | Description                           |
| ------ | --------------------------------------- | ------------------------------------- |
| POST   | `/product/`                             | Create a new product                  |
| GET    | `/product/getProductById/:productId`    | Get all products of specific category |
| GET    | `/product/all`                          | Get all products paginated            |
| GET    | `/product/allProductsOfTwoBrands`       | Get all products of 2 brands          |
| GET    | `/product/search`                       | Get all products using search         |
| PUT    | `/product/:productId`                   | Update product                        |
| DELETE | `/product/deleteProductById/:productId` | Delete product                        |
| DELETE | `/product/productsByBrandId/:brandId`   | Delete products of specific brand     |

### Review

| Method | URL                      | Description                         |
| ------ | ------------------------ | ----------------------------------- |
| POST   | `/review/`               | Add review to product               |
| GET    | `/review/productReviews` | Get all reviews of specific product |
| DELETE | `/review/:reviewId`      | Deliver review                      |

### Sub-Category

| Method | URL                                   | Description                                   |
| ------ | ------------------------------------- | --------------------------------------------- |
| POST   | `/subCategory/:categoryId`            | Create a new subCategory to specific category |
| GET    | `/subCategory/`                       | Get all categories                            |
| PUT    | `/subCategory/:subCategoryId`         | Update subCategory                            |
| GET    | `/subCategory/:subCategoryId`         | Get one subCategory                           |
| DELETE | `/subCategory/:subCategoryId`         | Delete subCategory                            |
| GET    | `/subCategory/paginatedSubCategories` | Get all subCategories paginated               |
| GET    | `/subCategory/filteredSubCategories`  | Apply Filter on subCategories                 |

### User

| Method | URL                     | Description                  |
| ------ | ----------------------- | ---------------------------- |
| PUT    | `/user/`                | Update User Profile          |
| PUT    | `/user/updatePassword`  | Update Password              |
| GET    | `/user/profile/:userId` | Get Profile of user using Id |
| GET    | `/user/myProfile`       | Get Private Profile          |
| DELETE | `/user/`                | Delete User                  |
