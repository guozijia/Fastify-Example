import { FastifyReply, FastifyRequest } from 'fastify'
import { createProductInput } from './product.schema'
import { createProduct, getProducts } from './product.serves'

export async function createPruductHandler(
  request: FastifyRequest<{
    Body: createProductInput
  }>,
  reply: FastifyReply
) {
  const body = request.body
  //request.user 从token读取user信息
  const product = await createProduct({ ...body, ownerId: request.user.id })
  return product
}

export async function getProductsHandler() {
  const products = await getProducts()
  return products
}
