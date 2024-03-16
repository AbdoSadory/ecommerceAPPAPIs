import mongoose, { Schema, model } from 'mongoose'

//============================== Create the brand schema ==============================//

const brandSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    Image: {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true, unique: true },
    },
    folderId: { type: String, required: true, unique: true },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: String,
    },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

brandSchema.virtual('Products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'brandId',
})
export default mongoose.models.Brand || model('Brand', brandSchema)
