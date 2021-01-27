import { ProductsFeedback } from '.'
import { User } from '../user'

let user, productsFeedback

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  productsFeedback = await ProductsFeedback.create({ user, product: 'test', feedback: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = productsFeedback.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(productsFeedback.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.product).toBe(productsFeedback.product)
    expect(view.feedback).toBe(productsFeedback.feedback)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = productsFeedback.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(productsFeedback.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.product).toBe(productsFeedback.product)
    expect(view.feedback).toBe(productsFeedback.feedback)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
