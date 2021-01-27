import { success, notFound } from '../../services/response/'
import { Products } from '.'
import { ProductsRating } from '../products-rating'
import ratingHelper from './helpers'

// export const create = ({ bodymen: { body } }, res, next) =>
//   Products.create(body)
//     .then((products) => products.view(true))
//     .then(success(res, 201))
//     .catch(next)
/////
export const create = async (
  {
    bodymen: {
      body: { title, price, discount, count, image, units, barcode, isActive }
    },
    params
  },
  res,
  next
) => {
  try {
    const obj = {}

    obj.title = title 
    obj.price = price
    if (discount !== 0) {
      obj.discount = discount
      obj.discountPrice = price - price * (discount / 100)
    }
    obj.count = count
    if (image) obj.image = image
    if (units) obj.units = units
    obj.barcode = barcode
    obj.isActive = isActive

    await Products.create(obj)
     .then((products) => products.view(true))
     .then(success(res, 201))
     .catch(next)
    //return res.status(201).json({ products })
  } catch (err) {
    next(err)
  }
}

/////
export const index = async (
  { querymen: { query, select, cursor } },
  res,
  next
) => {
  try {
    const count = await Products.countDocuments(query)
    let products = await Products.find(query, select, cursor)
    let rows = []
    for (const product of products) rows.push(await ratingHelper(product))

    return res.status(200).json({ count, rows })
  } catch (error) {
    next(error)
  }
}

export const show = async ({ params }, res, next) => {
  try {
    let product = await Products.findById(params.id)
    if (!product)
      return res.status(404).json({ valid: false, message: 'prod not found' })

    return res.status(200).json(await ratingHelper(product))
  } catch (error) {
    next(error)
  }
}

export const update = async (
  {
    bodymen: {
      body: { title, price, discount, count, image, units, barcode, isActive }
    },
    params
  },
  res,
  next
) => {
  try {
    let product = await Products.findById(params.id)
    if (!product) {
      return res
        .status(404)
        .json({ valid: false, message: 'Product not found' })
    }

    const obj = {}

    if (title) obj.title = title
    if (price) {
      obj.price = price
      if (product.discount !== 0)
        obj.discountPrice =
          price - price * (discount ? discount : product.discount / 100)
    }
    if (discount) {
      obj.discount = discount
      obj.discountPrice = price
        ? price
        : product.price - (price ? price : product.price * (discount / 100))
    }
    if (count) obj.count = count
    if (image) obj.image = image
    if (units) obj.units = units
    if (barcode) obj.barcode = barcode
    if (typeof isActive === 'boolean') obj.isActive = isActive

    product = await Object.assign(product, obj).save()
    return res.status(202).json({ product })
  } catch (err) {
    next(err)
  }
}


export const destroy = async ({ params }, res, next) => {
  try {
    let product = await Products.findById(params.id)
    let productRatings = await ProductsRating.find({product: params.id})
    if (!product)
      return res.status(404).json({ valid: false, message: 'prod not found' })
    product.remove()
    if(productRatings)
      for(const rating of productRatings)rating.remove()
    return res.status(200).json(product)
  } catch (error) {
    next(error)
  }
}

// export const destroy = ({ params }, res, next) =>{
//   Products.findById(params.id)
//     .then(notFound(res))
//     .then((products) => (products ? products.remove() : null))
//     .then(success(res, 204))
//     .catch(next)
//   ProductsRating.findById(params.id)
//     .then(notFound(res))
//     .then((productsRating) => productsRating ? productsRating.remove() : null)
//     .then(success(res, 204))
//     .catch(next)
// }