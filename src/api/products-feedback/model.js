import mongoose, { Schema } from 'mongoose'

const productsFeedbackSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.ObjectId,
    ref: "Products",
    required: true
  },
  feedback: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

productsFeedbackSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      product: this.product,
      feedback: this.feedback,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('ProductsFeedback', productsFeedbackSchema)

export const schema = model.schema
export default model
