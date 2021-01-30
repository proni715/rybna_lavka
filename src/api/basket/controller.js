import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Products } from '../products'
import { Basket } from '.'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Basket.count(query)
    .then((count) =>
      Basket.find(query, select, cursor)
        .populate('user')
        .then((baskets) => ({
          count,
          rows: baskets.map((basket) => basket.view())
        }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Basket.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((basket) => (basket ? basket.view() : null))
    .then(success(res))
    .catch(next)

export const update = async (
  { user, bodymen: { body :{product,count} }, params },
  res,
  next
) => {
  try {
    let basket = await Basket.findOne({ user: user._id })
    const productInDB = await Products.findById(product)
    if (!productInDB) {
      return res
        .status(404)
        .json({ valid: false, message: 'Product not found' })
    }
    if (basket.products.length > 0) {
      for(let element of basket.products){
        // console.log(element.product)
        // console.log(productInDB._id)
        // console.log(element.product.toString() == productInDB._id.toString())
        if(element.product.toString() === productInDB._id.toString()){
          element.count = count
          basket.view()
          basket.save()
          return res.status(201).json(basket)
        }
        
      }
      basket.products.push({product : productInDB ,count:count})
      basket.view()
      basket.save()      
    } else {
      basket.products.push({product : productInDB ,count:count})
      basket.view()
      basket.save()
    } 
    return res.status(201).json(basket)
  } catch (error) {
    next(error)
  }
}

// Basket.findById(params.id)
//   .populate('user')
//   .then(notFound(res))
//   .then(authorOrAdmin(res, user, 'user'))
//   .then((basket) => basket ? Object.assign(basket, body).save() : null)
//   .then((basket) => basket ? basket.view(true) : null)
//   .then(success(res))
//   .catch(next)
