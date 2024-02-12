import slugify from 'slugify'

import Brand from '../../../DB/Models/brand.model.js'
import subCategory from '../../../DB/Models/sub-category.model.js'
import cloudinaryConnection from '../../utils/cloudinary.js'
import generateUniqueString from '../../utils/generate-Unique-String.js'

//======================= add brand =======================//
export const addBrand = async (req, res, next) => {
  // 1- desturcture the required data from teh request object
  const { name } = req.body
  const { categoryId, subCategoryId } = req.query
  const { _id } = req.authUser
  // category check , subcategory check
  // 2- subcategory check
  const subCategoryCheck = await subCategory
    .findById(subCategoryId)
    .populate('categoryId', 'folderId')
  if (!subCategoryCheck)
    return next({ message: 'SubCategory not found', cause: 404 })

  // 3- duplicate  brand document check
  const isBrandExists = await Brand.findOne({ name, subCategoryId })
  if (isBrandExists)
    return next({
      message: 'Brand already exists for this subCategory',
      cause: 400,
    })

  // 4- categogry check
  if (categoryId != subCategoryCheck.categoryId._id)
    return next({ message: 'Category not found', cause: 404 })

  // 5 - generate the slug
  const slug = slugify(name, '-')

  // 6- upload brand logo
  if (!req.file)
    return next({ message: 'Please upload the brand logo', cause: 400 })

  const folderId = generateUniqueString(4)
  const { secure_url, public_id } =
    await cloudinaryConnection().uploader.upload(req.file.path, {
      folder: `${process.env.MAIN_FOLDER}/Categories/${subCategoryCheck.categoryId.folderId}/SubCategories/${subCategoryCheck.folderId}/Brands/${folderId}`,
    })

  const brandObject = {
    name,
    slug,
    Image: { secure_url, public_id },
    folderId,
    addedBy: _id,
    subCategoryId,
    categoryId,
  }

  const newBrand = await Brand.create(brandObject)

  res.status(201).json({
    status: 'success',
    message: 'Brand added successfully',
    data: newBrand,
  })
}

// ===================== get all brands ===================//
export const getAllBrands = async (req, res, next) => {
  const brands = await Brand.find()
  if (!brands) return next(new Error('Error while getting all brands'))

  res.status(200).json({ message: 'All Brands', brands })
}

// ===================== update brands ===================//
export const updateBrand = async (req, res, next) => {
  // 1- destructuring the supplied data from request object
  const { name, oldPublicId } = req.body
  const { brandId } = req.params
  const { _id } = req.authUser
  const { categoryId, subCategoryId } = req.query

  // 2- check if the Brand is exist by using brandId
  const isBrandExisted = await Brand.findById(brandId)
  if (!isBrandExisted)
    return next(new Error('No Brand with this id', { cause: 404 }))
  // 3- check if the Brand creator is the same one who updates
  if (isBrandExisted.addedBy.toString() !== _id.toString())
    return next(
      new Error('Brand creator must the same one who updates it', {
        cause: 403,
      })
    )

  // for more security confirmation
  // 4-check if brand is the desired brand with sub-category id
  // Maybe this brand is existed for another subcategory !
  if (isBrandExisted.subCategoryId.toString() !== subCategoryId)
    return next(
      new Error('There is no brand with this sub-category id', { cause: 404 })
    )
  // 5-check if brand is the desired brand with category id
  if (isBrandExisted.categoryId.toString() !== categoryId)
    return next(
      new Error('There is no brand with this category id', { cause: 404 })
    )

  // 6- check if the user want to update the name field
  if (name) {
    // 6.1 check if the new brand name different from the old name
    if (name === isBrandExisted.name) {
      return next(
        new Error('Please enter different Brand name from the existing one.', {
          cause: 400,
        })
      )
    }

    // 6.2 check if the new brand name is already exist in same subCategory
    const isNameDuplicated = await Brand.findOne({ name, subCategoryId })
    if (isNameDuplicated) {
      return next(
        new Error('Brand name is already exist in this sub-category', {
          cause: 409,
        })
      )
    }

    // 6.3 update the Brand name and the slug
    isBrandExisted.name = name
    isBrandExisted.slug = slugify(name, '-')
  }

  // 6- check if the user want to update the image
  if (oldPublicId) {
    if (!req.file) return next(new Error('Image is required', { cause: 400 }))
    // 6.1- check if the oldPublicId contains the folderId
    const isOldPublicIdValid = oldPublicId.includes(isBrandExisted.folderId)
    if (!isOldPublicIdValid)
      return next(
        new Error("Old Public Id doesn't contain brand folderId", {
          cause: 400,
        })
      )
    //6.2 new Public Id
    const newPulicId = oldPublicId.split(`${isBrandExisted.folderId}/`)[1]
    const { secure_url } = await cloudinaryConnection().uploader.upload(
      req.file.path,
      {
        folder: `${oldPublicId.split(`${isBrandExisted.folderId}/`)[0]}/${
          isBrandExisted.folderId
        }`,
        public_id: newPulicId,
      }
    )
    isBrandExisted.Image.secure_url = secure_url
  }

  // 7- set value for the updatedBy field
  isBrandExisted.updatedBy = _id

  await isBrandExisted.save()
  res.status(200).json({
    message: 'Brand has been updated successfully',
    brand: isBrandExisted,
  })
}

// ===================== delete brands ===================//
export const deleteBrand = async (req, res, next) => {
  // 1- destructuring the supplied data from request object
  const { brandId } = req.params
  const { categoryId, subCategoryId } = req.query

  // 2- check if the Brand is exist by using brandId
  const isBrandExisted = await Brand.findById(brandId).populate(
    'subCategoryId categoryId',
    'folderId'
  )
  if (!isBrandExisted)
    return next(new Error('No Brand with this id', { cause: 404 }))

  // for more security confirmation
  // 3-check if brand is the desired brand with sub-category id
  // Maybe this brand is existed for another subcategory !
  if (isBrandExisted.subCategoryId._id.toString() !== subCategoryId)
    return next(
      new Error('There is no brand with this sub-category id', { cause: 404 })
    )
  // 4-check if brand is the desired brand with category id
  if (isBrandExisted.categoryId._id.toString() !== categoryId)
    return next(
      new Error('There is no brand with this category id', { cause: 404 })
    )

  //  5- delete the brand
  const deletedBrand = await Brand.findByIdAndDelete(brandId)

  // 6- delete the brand folder from cloudinary
  try {
    await cloudinaryConnection().api.delete_resources_by_prefix(
      `${process.env.MAIN_FOLDER}/Categories/${isBrandExisted.categoryId.folderId}/SubCategories/${isBrandExisted.subCategoryId.folderId}/Brands/${isBrandExisted.folderId}`
    )
    await cloudinaryConnection().api.delete_folder(
      `${process.env.MAIN_FOLDER}/Categories/${isBrandExisted.categoryId.folderId}/SubCategories/${isBrandExisted.subCategoryId.folderId}/Brands/${isBrandExisted.folderId}`
    )
  } catch (error) {
    return next(new Error('Error While deleting the media'))
  }

  res
    .status(200)
    .json({ message: 'Brand has been deleted successfully', deletedBrand })
}
