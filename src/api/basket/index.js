import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { index, show, update, remove} from './controller'
import { schema } from './model'
import { Mongoose } from 'mongoose'
export Basket, { schema } from './model'

const router = new Router()
const { products, totalPrice } = schema.tree

/**
 * @api {get} /baskets Retrieve baskets
 * @apiName RetrieveBaskets
 * @apiGroup Basket
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of baskets.
 * @apiSuccess {Object[]} rows List of baskets.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/', token({ required: true }), query(), index)

/**
 * @api {get} /baskets/:id Retrieve basket
 * @apiName RetrieveBasket
 * @apiGroup Basket
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} basket Basket's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Basket not found.
 * @apiError 401 user access only.
 */
router.get('/:id', token({ required: true }), show)

/**
 * @api {put} /baskets/:id Update basket
 * @apiName UpdateBasket
 * @apiGroup Basket
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam products Basket's products.
 * @apiParam totalPrice Basket's totalPrice.
 * @apiSuccess {Object} basket Basket's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Basket not found.
 * @apiError 401 user access only.
 */
router.post(
  '/',
  token({ required: true }),
  body({ product: { type: String }, count: { type: Number } }),
  update
)

router.post(
  '/remove',
  token({ required: true }),
  body({ product: { type: String }}),
  remove
)

export default router
