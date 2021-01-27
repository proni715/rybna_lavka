import { ProductsRating } from '.'

let productsRating

beforeEach(async () => {
  productsRating = await ProductsRating.create({ product: 'test', rating: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = productsRating.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(productsRating.id)
    expect(view.product).toBe(productsRating.product)
    expect(view.rating).toBe(productsRating.rating)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = productsRating.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(productsRating.id)
    expect(view.product).toBe(productsRating.product)
    expect(view.rating).toBe(productsRating.rating)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
