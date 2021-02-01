import { success, notFound } from '../../services/response/'
import { Order } from '.'
import { Basket } from '../basket'


export const create = async ({ user, bodymen: { body:{name, phoneNumber, address,}}}, res, next)=> {
  try {
    let basket = await Basket.findOne({ user: user._id })
    let obj = {}
    obj.user = user
    obj.name = name
    obj.phoneNumber = phoneNumber,
    obj.address = address,
    obj.products = basket.products
    obj.totalPrice = basket.totalPrice,
    obj.status = 'accepted'
    await Order.create(obj)
     .then((order) => order.view(true))
     .then(success(res, 201))
     .catch(next)
  } catch (err) {
    next(err)
  }
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Order.find(query, select, cursor)
    .populate('user')
    .then((orders) => orders.map((order) => order.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Order.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((order) => order ? order.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Order.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((order) => order ? Object.assign(order, body).save() : null)
    .then((order) => order ? order.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Order.findById(params.id)
    .then(notFound(res))
    .then((order) => order ? order.remove() : null)
    .then(success(res, 204))
    .catch(next)
