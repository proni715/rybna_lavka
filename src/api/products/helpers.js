import { ProductsRating } from '../products-rating'

export default async function ratingHelper(product) {
  let rating = 0
  let count = 0
  const ratings = await ProductsRating.find({ product: product._id })
  ratings.map((r) => (rating += r.rating), (count += 1))

  product.rating = rating / count

  return product.view(true)
}
