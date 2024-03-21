import SubCategory from '../../../DB/Models/sub-category.model.js'
import Category from '../../../DB/Models/category.model.js'
import Brand from '../../../DB/Models/brand.model.js'
import generateUniqueString from '../../utils/generate-Unique-String.js'
import cloudinaryConnection from '../../utils/cloudinary.js'
import slugify from 'slugify'
import { APIFeatures } from '../../utils/api-features.js'

//============================== add SubCategory ==============================//
export const addSubCategory = async (req, res, next) => {
  // 1- destructuring the request body
  const { name } = req.body
  const { categoryId } = req.params
  const { _id } = req.authUser

  // 2- check if the subcategory name is already exist
  const isNameDuplicated = await SubCategory.findOne({ name })
  if (isNameDuplicated) {
    return next({ cause: 409, message: 'SubCategory name is already exist' })
    // return next( new Error('Category name is already exist' , {cause:409}) )
  }

  // 3- check if the category is exist by using categoryId
  const category = await Category.findById(categoryId)
  if (!category) return next({ cause: 404, message: 'Category not found' })

  // 4- generate the slug
  const slug = slugify(name, '-')

  // 5- upload image to cloudinary
  if (!req.file) return next({ cause: 400, message: 'Image is required' })

  const folderId = generateUniqueString(4)
  const { secure_url, public_id } =
    await cloudinaryConnection().uploader.upload(req.file.path, {
      folder: `${process.env.MAIN_FOLDER}/Categories/${category.folderId}/SubCategories/${folderId}`,
    })
  req.folder = `${process.env.MAIN_FOLDER}/Categories/${category.folderId}/SubCategories/${folderId}`

  // 6- generate the subCategory object
  const subCategory = {
    name,
    slug,
    Image: { secure_url, public_id },
    folderId,
    addedBy: _id,
    categoryId,
  }
  // 7- create the subCategory
  const subCategoryCreated = await SubCategory.create(subCategory)
  req.savedDocuments = { model: SubCategory, _id: subCategoryCreated._id }
  res.status(201).json({
    success: true,
    message: 'subCategory created successfully',
    data: subCategoryCreated,
  })
}

//============================All SubCategories with Brands=======================//
export const allSubCategoriesWithBrands = async (req, res, next) => {
  const { categoryId } = req.query
  let query = {}
  categoryId && (query.categoryId = categoryId)
  const subCategories = await SubCategory.find(query).populate('Brands')

  if (!subCategories)
    return next(new Error('Error while getting sub-categories'))

  res.status(200).json({ message: 'Sub-Categories with Brands', subCategories })
}

//============================update SubCategory=============================//
export const updateSubCategory = async (req, res, next) => {
  // 1- destructuring the request body
  const { name, oldPublicId } = req.body
  // 2- destructuring the request params
  const { subCategoryId } = req.params
  // 3- destructuring _id from the request authUser
  const { _id } = req.authUser

  // 4- check if the SubCategory is exist by using subCategoryId
  const isSubCategoryExisted = await SubCategory.findById(subCategoryId)
  if (!isSubCategoryExisted)
    return next(new Error('SubCategory not found', { cause: 404 }))

  // 5- check if the use want to update the name field
  if (name) {
    // 5.1 check if the new SubCategory name different from the old name
    if (name === isSubCategoryExisted.name) {
      return next(
        new Error(
          'Please enter different SubCategory name from the existing one.',
          {
            cause: 400,
          }
        )
      )
    }

    // 5.2 check if the new SubCategory name is already exist
    const isNameDuplicated = await SubCategory.findOne({ name })
    if (isNameDuplicated) {
      return next(
        new Error('SubCategory name is already exist', { cause: 409 })
      )
    }

    // 5.3 update the SubCategory name and the SubCategory slug
    isSubCategoryExisted.name = name
    isSubCategoryExisted.slug = slugify(name, '-')
  }

  // 6- check if the user want to update the image
  if (oldPublicId) {
    if (!req.file) return next(new Error('Image is required', { cause: 400 }))
    // oldPublicId = Ecommerce/Categories/gs4g/SubCategories/s2fa/fplv4epwhn1zd8zgmido
    const newPulicId = oldPublicId.split(`${isSubCategoryExisted.folderId}/`)[1] //fplv4epwhn1zd8zgmido

    const { secure_url } = await cloudinaryConnection().uploader.upload(
      req.file.path,
      {
        folder: `${oldPublicId.split(`${isSubCategoryExisted.folderId}/`)[0]}/${
          isSubCategoryExisted.folderId
        }`,
        public_id: newPulicId,
      }
    )
    isSubCategoryExisted.Image.secure_url = secure_url
  }

  // 7- set value for the updatedBy field
  isSubCategoryExisted.updatedBy = _id

  await isSubCategoryExisted.save()
  res.status(200).json({
    message: 'Sub-category updated successfully',
    data: isSubCategoryExisted,
  })
}

//============================delete SubCategory=============================//
export const deleteSubCategory = async (req, res, next) => {
  const { subCategoryId } = req.params

  // 1- delete sub-category
  const subCategory = await SubCategory.findByIdAndDelete(
    subCategoryId
  ).populate('categoryId')
  if (!subCategory)
    return next(new Error('sub-category not found', { cause: 404 }))

  //2- delete the related brands
  const brands = await Brand.deleteMany({ subCategoryId })
  if (brands.deletedCount <= 0) {
    console.log(brands.deletedCount)
    console.log('There is no related brands')
  }

  // 3- delete the sub-category folder from cloudinary
  try {
    await cloudinaryConnection().api.delete_resources_by_prefix(
      `${process.env.MAIN_FOLDER}/Categories/${subCategory.categoryId.folderId}/SubCategories/${subCategory.folderId}`
    )
    await cloudinaryConnection().api.delete_folder(
      `${process.env.MAIN_FOLDER}/Categories/${subCategory.categoryId.folderId}/SubCategories/${subCategory.folderId}`
    )
  } catch (error) {
    return next(new Error('Error while deleting the Media'))
  }

  res
    .status(200)
    .json({ success: true, message: 'Sub-Category deleted successfully' })
}

//============================ get SubCategory=======================//
export const getSubCategory = async (req, res, next) => {
  const subCategory = await SubCategory.find().populate('Brands')

  if (!subCategory) return next(new Error('Error while getting sub-category'))

  res.status(200).json({
    message: 'Sub-Category has been fetched successfully',
    subCategory,
  })
}

//================================= get all subcategories paginated ====================//
export const getAllSubCategoriesPaginated = async (req, res, next) => {
  // destruct the page number from query
  const { page } = req.query
  // we set the size of SubCategories per page because we know our data 🔥
  const size = 3
  // we get total pages number to be sent in response to client
  const pages = Math.ceil((await SubCategory.find().countDocuments()) / size)

  const paginationFeature = new APIFeatures(SubCategory.find()).pagination({
    page,
    size,
  })

  const subcategories = await paginationFeature.mongooseQuery
  if (!subcategories)
    return next(
      new Error('Error while getting Subcategories from search method')
    )

  res
    .status(200)
    .json({ message: `SubCategories`, pages, page: +page, subcategories })
}

//================================= get all subcategories filtered ====================//
export const getAllSubCategoriesFiltered = async (req, res, next) => {
  const { ...filter } = req.query

  const filteredFeature = new APIFeatures(SubCategory.find()).filters(filter)

  const subcategories = await filteredFeature.mongooseQuery
  if (!subcategories)
    return next(
      new Error('Error while getting Subcategories from filter method')
    )

  res.status(200).json({ message: `SubCategories`, subcategories })
}
