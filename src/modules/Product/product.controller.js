import slugify from 'slugify'

import Brand from '../../../DB/Models/brand.model.js'
import Product from '../../../DB/Models/product.model.js'
import { systemRoles } from '../../utils/system-roles.js'
import cloudinaryConnection from '../../utils/cloudinary.js'
import generateUniqueString from '../../utils/generate-Unique-String.js'
import { APIFeatures } from '../../utils/api-features.js'

/**
 *
 * @param {*} req body: {title, desc, basePrice, discount, stock, specs}  authUser
 * @param {*} req query: {categoryId, subCategoryId, brandId}
 * @param {*} req authUser :{_id}
 * @returns the created product data with status 201 and success message
 * @description add a product to the database
 */

//================================= Add product API =================================//
export const addProduct = async (req, res, next) => {
  // data from the request body
  const { title, desc, basePrice, discount, stock, specs } = req.body
  // data from the request query
  const { categoryId, subCategoryId, brandId } = req.query
  // data from the request authUser
  const addedBy = req.authUser._id

  // brand check
  const brand = await Brand.findById(brandId)
  if (!brand) return next({ cause: 404, message: 'Brand not found' })

  // category check
  if (brand.categoryId.toString() !== categoryId)
    return next({ cause: 400, message: 'Brand not found in this category' })
  // sub-category check
  if (brand.subCategoryId.toString() !== subCategoryId)
    return next({ cause: 400, message: 'Brand not found in this sub-category' })

  // who will be authorized to add a product
  if (
    req.authUser.role !== systemRoles.SUPER_ADMIN &&
    brand.addedBy.toString() !== addedBy.toString()
  )
    return next({
      cause: 403,
      message: 'You are not authorized to add a product to this brand',
    })

  // generate the product  slug
  const slug = slugify(title, { lower: true, replacement: '-' }) //  lowercase: true

  //  applied price calculations
  const appliedPrice = basePrice - (basePrice * (discount || 0)) / 100

  console.log(specs)

  //Images
  if (!req.files?.length)
    return next({ cause: 400, message: 'Images are required' })
  const Images = []
  const folderId = generateUniqueString(4)
  const folderPath = brand.Image.public_id.split(`${brand.folderId}/`)[0]

  for (const file of req.files) {
    // ecommerce-project/Categories/4aa3/SubCategories/fhgf/Brands/5asf/z2wgc418otdljbetyotn
    const { secure_url, public_id } =
      await cloudinaryConnection().uploader.upload(file.path, {
        folder: folderPath + `${brand.folderId}/Products/${folderId}`,
      })
    Images.push({ secure_url, public_id })
  }
  req.folder = folderPath + `${brand.folderId}/Products/${folderId}`

  // prepare the product object for db
  const product = {
    title,
    desc,
    slug,
    basePrice,
    discount,
    appliedPrice,
    stock,
    specs: JSON.parse(specs),
    categoryId,
    subCategoryId,
    brandId,
    addedBy,
    Images,
    folderId,
  }

  const newProduct = await Product.create(product)
  req.savedDocuments = { model: Product, _id: newProduct._id }

  res.status(201).json({
    message: 'Product created successfully',
    data: newProduct,
  })
}

/**
 *
 * @param {*} req body: {title, desc, basePrice, discount, stock, specs}
 * @param {*} req params : {productId}
 * @param {*} req authUser :{_id}
 * @returns the updated product data with status 200 and success message
 * @description update a product in the database
 */

//================================================= Update product API ============================================//
export const updateProduct = async (req, res, next) => {
  // data from the request body
  const { title, desc, specs, stock, basePrice, discount, oldPublicId } =
    req.body
  // data for condition
  const { productId } = req.params
  // data from the request authUser
  const addedBy = req.authUser._id

  // prodcuct Id
  const product = await Product.findById(productId)
  if (!product) return next({ cause: 404, message: 'Product not found' })

  // who will be authorized to update a product
  if (
    req.authUser.role !== systemRoles.SUPER_ADMIN &&
    product.addedBy.toString() !== addedBy.toString()
  )
    return next({
      cause: 403,
      message: 'You are not authorized to update this product',
    })

  // title update
  if (title) {
    product.title = title
    product.slug = slugify(title, { lower: true, replacement: '-' })
  }
  if (desc) product.desc = desc
  if (specs) product.specs = JSON.parse(specs)
  if (stock) product.stock = stock

  // prices changes
  // const appliedPrice = (basePrice || product.basePrice) - ((basePrice || product.basePrice) * (discount || product.discount) / 100)
  const appliedPrice =
    (basePrice || product.basePrice) *
    (1 - (discount || product.discount) / 100)
  product.appliedPrice = appliedPrice

  if (basePrice) product.basePrice = basePrice
  if (discount) product.discount = discount

  if (oldPublicId) {
    if (!req.file)
      return next({ cause: 400, message: 'Please select new image' })

    const folderPath = product.Images[0].public_id.split(
      `${product.folderId}/`
    )[0]
    const newPublicId = oldPublicId.split(`${product.folderId}/`)[1]

    const { secure_url } = await cloudinaryConnection().uploader.upload(
      req.file.path,
      {
        folder: folderPath + `${product.folderId}`,
        public_id: newPublicId,
      }
    )

    product.Images.map((img) => {
      if (img.public_id === oldPublicId) {
        img.secure_url = secure_url
      }
    })
    req.folder = folderPath + `${product.folderId}`
  }

  await product.save()

  res.status(200).json({
    message: 'Product has been updated successfully',
    product,
  })
}

//================================= Delete Product ====================//
export const deleteProduct = async (req, res, next) => {
  const { productId } = req.params
  const addedBy = req.authUser._id

  // prodcuct Id
  const product = await Product.findById(productId).populate(
    'categoryId subCategoryId brandId',
    'folderId'
  )
  if (!product) return next({ cause: 404, message: 'Product not found' })

  // who will be authorized to delete a product
  if (
    req.authUser.role !== systemRoles.SUPER_ADMIN &&
    product.addedBy.toString() !== addedBy.toString()
  )
    return next({
      cause: 403,
      message: 'You are not authorized to delete this product',
    })

  const deleteProduct = await Product.findByIdAndDelete(productId)
  if (!deleteProduct) return next('Error While Deleting The Product')

  try {
    await cloudinaryConnection().api.delete_resources_by_prefix(
      `${process.env.MAIN_FOLDER}/Categories/${product.categoryId.folderId}/SubCategories/${product.subCategoryId.folderId}/Brands/${product.brandId.folderId}/Products/${product.folderId}`
    )
    await cloudinaryConnection().api.delete_folder(
      `${process.env.MAIN_FOLDER}/Categories/${product.categoryId.folderId}/SubCategories/${product.subCategoryId.folderId}/Brands/${product.brandId.folderId}/Products/${product.folderId}`
    )
  } catch (error) {
    return next(new Error('Error while deleting the Media'))
  }

  res.status(200).json({
    message: 'Product has been deleted successfully',
  })
}

//================================= get Product by id ====================//
export const getProductById = async (req, res, next) => {
  const { productId } = req.params
  const product = await Product.findById(productId)
  if (!product) return next(new Error('No Product with this Id'))

  res.status(200).json({ message: `Product with id: ${productId}`, product })
}
//================================= search on products ====================//
export const searchOnProducts = async (req, res, next) => {
  // Destruct all fields from query
  const { ...search } = req.query
  // use search in APIFeatures
  const searchFeature = new APIFeatures(Product.find()).search(search)
  const products = await searchFeature.mongooseQuery
  if (!products)
    return next(new Error('Error while getting Products from search method'))

  res.status(200).json({ message: `Products`, products })
}

//================================= get all products paginated ====================//
export const getAllProductsPaginated = async (req, res, next) => {
  // destruct the page number from query
  const { page } = req.query
  // we set the size of products per page because we know our data 🔥
  const size = 3
  // we get total pages number to be sent in response to client
  const pages = Math.ceil((await Product.find().countDocuments()) / 3)

  const paginationFeature = new APIFeatures(Product.find()).pagination({
    page,
    size,
  })

  const products = await paginationFeature.mongooseQuery
  if (!products)
    return next(new Error('Error while getting Products from search method'))

  res.status(200).json({ message: `Products`, pages, page: +page, products })
}

//================================= get all products for 2 brands ====================//
export const getAllProductsOfTwoBrands = async (req, res, next) => {
  // destruct the brandId from query
  const { ...filter } = req.query
  // convert brandsId from string to array by
  // replace "[" and "]", then split with ","
  const brandsId = filter.brandId.in.replace(/\[|\]/g, '').split(',')
  // assign $in operator with brandsId
  filter.brandId.in = brandsId

  const filteredFeature = new APIFeatures(Product.find()).filters(filter)

  const products = await filteredFeature.mongooseQuery
  if (!products)
    return next(new Error('Error while getting Products from filter method'))

  res
    .status(200)
    .json({ message: `Products with brandsId: [${brandsId}]`, products })
}

//================================= delete Many products by brand Id====================//
export const deleteManyProductsByBrandId = async (req, res, next) => {
  // destruct the brandId from query
  const { brandId } = req.query
  const deletedProducts = await Product.deleteMany({ brandId })
  if (!deletedProducts.deletedCount)
    // log the result in the server
    console.log('No Products have been deleted by this brand id')

  res
    .status(200)
    .json({ message: `Products have been deleted by brand id : [${brandId}]` })
}
