import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Products } from '../products'
import { Basket } from '.'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Basket.count(query)
    .then((count) =>
      Basket.find(query, select, cursor)
        .populate('user')
        .then((baskets) => ({
          count,
          rows: baskets.map((basket) => basket.view())
        }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Basket.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((basket) => (basket ? basket.view() : null))
    .then(success(res))
    .catch(next)

export const update = async (
  {
    user,
    bodymen: {
      body: { product, count }
    }
  },
  res,
  next
) => {
  try {
    let basket = await Basket.findOne({ user: user._id }).populate('products.product')
    const productInDB = await Products.findById(product)
    if (!productInDB) {
      return res
        .status(404)
        .json({ valid: false, message: 'Product not found' })
    }
    if (basket.products.length > 0) {
      let duplicate = false
      for (let element of basket.products) {
        if (element.product.toString() === productInDB._id.toString()) {
          duplicate = true
          element.count = count
        }
      }
      if (!duplicate) {
        await basket.products.push({
          product: productInDB,
          count: count
        })
      }
    } else {
      await basket.products.push({
        product: productInDB,
        count: count
      })
    }
    let total = 0
    for (let element of basket.products) {
      if (!element.product.discount) {
        total += element.product.price * element.count
      } else {
        total += element.product.discountPrice * element.count
      }
    }
    basket.totalPrice = total
    basket.view(true)
    await basket.save()
    console.log(basket)
    return res.status(201).json(basket)
  } catch (error) {
    next(error)
  }
}

export const remove = async (
  {
    user,
    bodymen: {
      body: { product }
    }
  },
  res,
  next
) => {
  try {
    let basket = await Basket.findOne({ user: user._id })
    const productInDB = await Products.findById(product)

    for (let element of basket.products) {
      if (element.product.toString() === productInDB._id.toString()) {
        element.remove()
      }
    }
    let total = 0
    for (let element of basket.products) {
      let item = await Products.findById(element.product)
      console.log(item)
      if (!item.discount) {
        total += item.price * element.count
        console.log(element.product.price)
      } else {
        total += item.discountPrice * element.count
        console.log(element.product.discountPrice)
      }
    }
    basket.totalPrice = total
    basket.view(true)
    await basket.save()
    console.log(basket)
    return res.status(201).json(basket)
  } catch (error) {
    next(error)
  }
}
