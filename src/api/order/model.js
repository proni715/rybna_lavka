import mongoose, { Schema } from 'mongoose'

const orderSchema = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true
    },
    products: [
      {
        _id: false,
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
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['accepted', 'processing', 'completed'],
      default: 'accepted'
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

orderSchema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user,
      products: this.products,
      totalPrice: this.totalPrice,
      status: this.status,
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

const model = mongoose.model('Order', orderSchema)

export const schema = model.schema
export default model
