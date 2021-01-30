import { success, notFound } from '../../services/response/'
import { ProductsRating } from '.'

export const create = async ({ bodymen: { body }, user }, res, next) => {
  body.user = user._id
  const productRating = await ProductsRating.findOne({
    product: body.product,
    user: user._id
  })
  if (productRating)
    return res.status(409).json({ valid: false, message: 'duplicate' })
  await ProductsRating.create(body)
    .then((productsRating) => productsRating.view(true))
    .then(success(res, 201))
    .catch(next)
}
export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  ProductsRating.count(query)
    .then((count) =>
      ProductsRating.find(query, select, cursor)
        .populate('user product', "role picture name email title price discount discountPrice count")
        .then((productsRatings) => ({
          count,
          rows: productsRatings.map((productsRating) => productsRating.view())
        }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  ProductsRating.findById(params.id)
    .then(notFound(res))
    .then((productsRating) => (productsRating ? productsRating.view() : null))
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  ProductsRating.findById(params.id)
    .then(notFound(res))
    .then((productsRating) =>
      productsRating ? Object.assign(productsRating, body).save() : null
    )
    .then((productsRating) =>
      productsRating ? productsRating.view(true) : null
    )
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  ProductsRating.findById(params.id)
    .then(notFound(res))
    .then((productsRating) => (productsRating ? productsRating.remove() : null))
    .then(success(res, 204))
    .catch(next)
