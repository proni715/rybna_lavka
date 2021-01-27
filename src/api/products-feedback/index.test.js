import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { ProductsFeedback } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, productsFeedback

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  productsFeedback = await ProductsFeedback.create({ user })
})

test('POST /products-feedbacks 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, product: 'test', feedback: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.product).toEqual('test')
  expect(body.feedback).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /products-feedbacks 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /products-feedbacks 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
  expect(typeof body.rows[0].user).toEqual('object')
})

test('GET /products-feedbacks 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /products-feedbacks/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${productsFeedback.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(productsFeedback.id)
  expect(typeof body.user).toEqual('object')
})

test('GET /products-feedbacks/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${productsFeedback.id}`)
  expect(status).toBe(401)
})

test('GET /products-feedbacks/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /products-feedbacks/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${productsFeedback.id}`)
    .send({ access_token: userSession, product: 'test', feedback: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(productsFeedback.id)
  expect(body.product).toEqual('test')
  expect(body.feedback).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /products-feedbacks/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${productsFeedback.id}`)
    .send({ access_token: anotherSession, product: 'test', feedback: 'test' })
  expect(status).toBe(401)
})

test('PUT /products-feedbacks/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${productsFeedback.id}`)
  expect(status).toBe(401)
})

test('PUT /products-feedbacks/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, product: 'test', feedback: 'test' })
  expect(status).toBe(404)
})

test('DELETE /products-feedbacks/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${productsFeedback.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /products-feedbacks/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${productsFeedback.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /products-feedbacks/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${productsFeedback.id}`)
  expect(status).toBe(401)
})

test('DELETE /products-feedbacks/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
