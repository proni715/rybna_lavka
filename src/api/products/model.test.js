import { Products } from '.'

let products

beforeEach(async () => {
  products = await Products.create({ title: 'test', price: 'test', discount: 'test', discountPrice: 'test', rating: 'test', count: 'test', image: 'test', units: 'test', barcode: 'test', isActive: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = products.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(products.id)
    expect(view.title).toBe(products.title)
    expect(view.price).toBe(products.price)
    expect(view.discount).toBe(products.discount)
    expect(view.discountPrice).toBe(products.discountPrice)
    expect(view.rating).toBe(products.rating)
    expect(view.count).toBe(products.count)
    expect(view.image).toBe(products.image)
    expect(view.units).toBe(products.units)
    expect(view.barcode).toBe(products.barcode)
    expect(view.isActive).toBe(products.isActive)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = products.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(products.id)
    expect(view.title).toBe(products.title)
    expect(view.price).toBe(products.price)
    expect(view.discount).toBe(products.discount)
    expect(view.discountPrice).toBe(products.discountPrice)
    expect(view.rating).toBe(products.rating)
    expect(view.count).toBe(products.count)
    expect(view.image).toBe(products.image)
    expect(view.units).toBe(products.units)
    expect(view.barcode).toBe(products.barcode)
    expect(view.isActive).toBe(products.isActive)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
