import mongoose, { Schema } from 'mongoose'

const productsRatingSchema = new Schema({
  product: {
    type: mongoose.ObjectId,
    ref: "Products",
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

productsRatingSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      product: this.product,
      rating: this.rating,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('ProductsRating', productsRatingSchema)

export const schema = model.schema
export default model
