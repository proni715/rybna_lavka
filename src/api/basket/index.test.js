import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Basket } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, basket

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  basket = await Basket.create({ user })
})

test('POST /baskets 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, products: 'test', totalPrice: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.products).toEqual('test')
  expect(body.totalPrice).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /baskets 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /baskets 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
  expect(typeof body.rows[0].user).toEqual('object')
})

test('GET /baskets 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /baskets/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${basket.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(basket.id)
  expect(typeof body.user).toEqual('object')
})

test('GET /baskets/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${basket.id}`)
  expect(status).toBe(401)
})

test('GET /baskets/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /baskets/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${basket.id}`)
    .send({ access_token: userSession, products: 'test', totalPrice: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(basket.id)
  expect(body.products).toEqual('test')
  expect(body.totalPrice).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /baskets/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${basket.id}`)
    .send({ access_token: anotherSession, products: 'test', totalPrice: 'test' })
  expect(status).toBe(401)
})

test('PUT /baskets/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${basket.id}`)
  expect(status).toBe(401)
})

test('PUT /baskets/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, products: 'test', totalPrice: 'test' })
  expect(status).toBe(404)
})

test('DELETE /baskets/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${basket.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /baskets/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${basket.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /baskets/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${basket.id}`)
  expect(status).toBe(401)
})

test('DELETE /baskets/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
