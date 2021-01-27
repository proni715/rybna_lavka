import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { ProductsRating } from '.'

const app = () => express(apiRoot, routes)

let productsRating

beforeEach(async () => {
  productsRating = await ProductsRating.create({})
})

test('POST /products-ratings 201', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ product: 'test', rating: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.product).toEqual('test')
  expect(body.rating).toEqual('test')
})

test('GET /products-ratings 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /products-ratings/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${productsRating.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(productsRating.id)
})

test('GET /products-ratings/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /products-ratings/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${productsRating.id}`)
    .send({ product: 'test', rating: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(productsRating.id)
  expect(body.product).toEqual('test')
  expect(body.rating).toEqual('test')
})

test('PUT /products-ratings/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ product: 'test', rating: 'test' })
  expect(status).toBe(404)
})

test('DELETE /products-ratings/:id 204', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${productsRating.id}`)
  expect(status).toBe(204)
})

test('DELETE /products-ratings/:id 404', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})
