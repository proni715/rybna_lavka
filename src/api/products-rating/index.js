import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export ProductsRating, { schema } from './model'

const router = new Router()
const { product, rating, feedback } = schema.tree

/**
 * @api {post} /products-ratings Create products rating
 * @apiName CreateProductsRating
 * @apiGroup ProductsRating
 * @apiParam product Products rating's product.
 * @apiParam rating Products rating's rating.
 * @apiSuccess {Object} productsRating Products rating's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Products rating not found.
 */
router.post(
  '/',
  body({ product, rating, feedback }),
  token({ required: true }),
  create
)

/**
 * @api {get} /products-ratings Retrieve products ratings
 * @apiName RetrieveProductsRatings
 * @apiGroup ProductsRating
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of products ratings.
 * @apiSuccess {Object[]} rows List of products ratings.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/', query(), index)

/**
 * @api {get} /products-ratings/:id Retrieve products rating
 * @apiName RetrieveProductsRating
 * @apiGroup ProductsRating
 * @apiSuccess {Object} productsRating Products rating's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Products rating not found.
 */
router.get('/:id', show)

/**
 * @api {put} /products-ratings/:id Update products rating
 * @apiName UpdateProductsRating
 * @apiGroup ProductsRating
 * @apiParam product Products rating's product.
 * @apiParam rating Products rating's rating.
 * @apiSuccess {Object} productsRating Products rating's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Products rating not found.
 */
router.put(
  '/:id',
  body({ product, rating, feedback }),
  token({ required: true }),
  update
)

/**
 * @api {delete} /products-ratings/:id Delete products rating
 * @apiName DeleteProductsRating
 * @apiGroup ProductsRating
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Products rating not found.
 */
router.delete('/:id', token({ required: true }), destroy)

export default router
