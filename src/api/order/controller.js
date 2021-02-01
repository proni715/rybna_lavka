import { success, notFound } from '../../services/response/'
import { Order } from '.'
import { Basket } from '../basket'

export const create = async ({ user }, res, next) => {
  try {
    const { products, totalPrice } = await Basket.findOne({
      user: user._id
    }).populate('products.product')

    await Order.create({
      user,
      products,
      totalPrice
    })
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
    .then((order) => (order ? order.view() : null))
    .then(success(res))
    .catch(next)

export const update = async (
  {
    bodymen: {
      body: { status }
    },
    params
  },
  res,
  next
) => {
  try {
    let order = await Order.findById(params.id).populate('user')
    console.log(status);
    order = await Object.assign(order, { status }).save()
    return res.status(202).json(order.view(true))
  } catch (error) {
    next(error)
  }
}

export const destroy = ({ params }, res, next) =>
  Order.findById(params.id)
    .then(notFound(res))
    .then((order) => (order ? order.remove() : null))
    .then(success(res, 204))
    .catch(next)
