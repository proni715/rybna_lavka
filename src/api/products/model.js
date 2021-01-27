import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'

const productsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    units: {
      type: {
        type: String,
        enum: ['kg', 'g', 'l', 'ml', 'psc'],
      },
      count: {
        type: Number,
        required: true,
      },
    },
    barcode: {
      type: Number,
      required: true,
    },
    isActive: {
      type: String,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (obj, ret) => {
        delete ret._id
      },
    },
  }
)

productsSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      title: this.title,
      price: this.price,
      discount: this.discount,
      discountPrice: this.discountPrice,
      rating: this.rating,
      count: this.count,
      image: this.image,
      units: this.units,
      barcode: this.barcode,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }

    return full
      ? {
          ...view,
          // add properties for a full view
        }
      : view
  },
}

productsSchema.plugin(mongooseKeywords, { paths: ['title'] })
const model = mongoose.model('Products', productsSchema)

export const schema = model.schema
export default model
