import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export ProductsFeedback, { schema } from './model'

const router = new Router()
const { product, feedback } = schema.tree

/**
 * @api {post} /products-feedbacks Create products feedback
 * @apiName CreateProductsFeedback
 * @apiGroup ProductsFeedback
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam product Products feedback's product.
 * @apiParam feedback Products feedback's feedback.
 * @apiSuccess {Object} productsFeedback Products feedback's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Products feedback not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ product, feedback }),
  create)

/**
 * @api {get} /products-feedbacks Retrieve products feedbacks
 * @apiName RetrieveProductsFeedbacks
 * @apiGroup ProductsFeedback
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of products feedbacks.
 * @apiSuccess {Object[]} rows List of products feedbacks.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /products-feedbacks/:id Retrieve products feedback
 * @apiName RetrieveProductsFeedback
 * @apiGroup ProductsFeedback
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} productsFeedback Products feedback's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Products feedback not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /products-feedbacks/:id Update products feedback
 * @apiName UpdateProductsFeedback
 * @apiGroup ProductsFeedback
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam product Products feedback's product.
 * @apiParam feedback Products feedback's feedback.
 * @apiSuccess {Object} productsFeedback Products feedback's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Products feedback not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ product, feedback }),
  update)

/**
 * @api {delete} /products-feedbacks/:id Delete products feedback
 * @apiName DeleteProductsFeedback
 * @apiGroup ProductsFeedback
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Products feedback not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
