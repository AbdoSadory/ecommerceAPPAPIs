import mongoose, { Schema, model } from 'mongoose'

//============================== Create the brand schema ==============================//

const reviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    reviewComment: { type: String },
    reviewRate: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      enum: [0, 1, 2, 3, 4, 5],
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

export default mongoose.models.Review || model('Review', reviewSchema)
