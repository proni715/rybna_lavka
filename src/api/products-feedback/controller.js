import { success, notFound, authorOrAdmin } from '../../services/response/'
import { ProductsFeedback } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  ProductsFeedback.create({ ...body, user })
    .then((productsFeedback) => productsFeedback.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  ProductsFeedback.count(query)
    .then(count => ProductsFeedback.find(query, select, cursor)
      .populate('user')
      .then((productsFeedbacks) => ({
        count,
        rows: productsFeedbacks.map((productsFeedback) => productsFeedback.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  ProductsFeedback.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((productsFeedback) => productsFeedback ? productsFeedback.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  ProductsFeedback.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((productsFeedback) => productsFeedback ? Object.assign(productsFeedback, body).save() : null)
    .then((productsFeedback) => productsFeedback ? productsFeedback.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  ProductsFeedback.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((productsFeedback) => productsFeedback ? productsFeedback.remove() : null)
    .then(success(res, 204))
    .catch(next)
