import mongoose, { Schema } from 'mongoose'

const productsRatingSchema = new Schema(
  {
    user: {
      type: mongoose.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    product: {
      type: mongoose.ObjectId,
      ref: 'Products',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    feedback: {
      type: String,
      maxlength: 256
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (obj, ret) => {
        delete ret._id
      }
    }
  }
)

productsRatingSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      user:  this.user,
      product: this.product,
      rating: this.rating,
      feedback: this.feedback,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full
      ? {
          ...view
          // add properties for a full view
        }
      : view
  }
}

productsRatingSchema.index({ product: 1, user: 1 }, { unique: true })

const model = mongoose.model('ProductsRating', productsRatingSchema)

export const schema = model.schema
export default model
