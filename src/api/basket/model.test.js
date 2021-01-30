import { Basket } from '.'
import { User } from '../user'

let user, basket

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  basket = await Basket.create({ user, products: 'test', totalPrice: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = basket.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(basket.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.products).toBe(basket.products)
    expect(view.totalPrice).toBe(basket.totalPrice)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = basket.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(basket.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.products).toBe(basket.products)
    expect(view.totalPrice).toBe(basket.totalPrice)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
