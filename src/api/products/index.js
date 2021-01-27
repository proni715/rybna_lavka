import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Products, { schema } from './model'

const router = new Router()
const {
  title,
  price,
  discount,
  discountPrice,
  rating,
  count,
  image,
  units,
  barcode,
  isActive
} = schema.tree

/**
 * @api {post} /products Create products
 * @apiName CreateProducts
 * @apiGroup Products
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam title Products's title.
 * @apiParam price Products's price.
 * @apiParam discount Products's discount.
 * @apiParam discountPrice Products's discountPrice.
 * @apiParam rating Products's rating.
 * @apiParam count Products's count.
 * @apiParam image Products's image.
 * @apiParam units Products's units.
 * @apiParam barcode Products's barcode.
 * @apiParam isActive Products's isActive.
 * @apiSuccess {Object} products Products's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Products not found.
 * @apiError 401 admin access only.
 */
router.post(
  '/',
  token({ required: true, roles: ['admin'] }),
  body({
    title,
    price,
    discount,
    discountPrice,
    rating,
    count,
    image,
    units,
    barcode,
    isActive
  }),
  create
)

/**
 * @api {get} /products Retrieve products
 * @apiName RetrieveProducts
 * @apiGroup Products
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of products.
 * @apiSuccess {Object[]} rows List of products.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/', query(), index)

/**
 * @api {get} /products/:id Retrieve products
 * @apiName RetrieveProducts
 * @apiGroup Products
 * @apiSuccess {Object} products Products's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Products not found.
 */
router.get('/:id', show)

/**
 * @api {put} /products/:id Update products
 * @apiName UpdateProducts
 * @apiGroup Products
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam title Products's title.
 * @apiParam price Products's price.
 * @apiParam discount Products's discount.
 * @apiParam discountPrice Products's discountPrice.
 * @apiParam rating Products's rating.
 * @apiParam count Products's count.
 * @apiParam image Products's image.
 * @apiParam units Products's units.
 * @apiParam barcode Products's barcode.
 * @apiParam isActive Products's isActive.
 * @apiSuccess {Object} products Products's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Products not found.
 * @apiError 401 admin access only.
 */
router.put(
  '/:id',
  token({ required: true, roles: ['admin'] }),
  body({
    title: { ...title, required: false },
    price: { ...price, required: false },
    discount,
    discountPrice,
    rating,
    count:{ ...count, required: false },
    image,
    units,
    barcode: { ...barcode, required: false },
    isActive
  }),
  update
)

/**
 * @api {delete} /products/:id Delete products
 * @apiName DeleteProducts
 * @apiGroup Products
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Products not found.
 * @apiError 401 admin access only.
 */
router.delete('/:id', token({ required: true, roles: ['admin'] }), destroy)

export default router
