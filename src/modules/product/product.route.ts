import { FastifyInstance } from 'fastify'
import { createPruductHandler, getProductsHandler } from './product.controller'
import { $ref } from './product.schema'

async function ProductRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [app.authenticate],
      schema: {
        body: $ref('createProductSchema'),
        response: {
          201: $ref('createProductResponseSchema')
        }
      }
    },
    createPruductHandler
  )
  app.get(
    '/',
    {
      schema: {
        response: {
          200: $ref('productsResponseSchema')
        }
      }
    },
    getProductsHandler
  )
}

export default ProductRoutes
