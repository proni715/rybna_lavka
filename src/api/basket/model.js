import mongoose, { Schema } from 'mongoose'

const basketSchema = new Schema(
  {
    user: {
      type: mongoose.ObjectId,
      ref: 'User',
      required: true
    },
    products: [
      {
        product: {
          type: mongoose.ObjectId,
          ref: 'Products',
          required: true
        },
        count: {
          type: Number,
          required: true,
          min: 1
        }
      }
    ],
    totalPrice: {
      type: Number
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

basketSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      products: this.products,
      totalPrice: this.totalPrice,
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

const model = mongoose.model('Basket', basketSchema)

export const schema = model.schema
export default model
