import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const productCore = {
  title: z.string(),
  content: z.string().optional(), //可选的
  price: z.number()
}

const productGenrated = {
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string()
}

//创建
const createProductSchema = z.object({
  ...productCore
})
//创建返回
const createProductResponseSchema = z.object({
  ...productCore,
  ...productGenrated,
  owner: z.object({
    email: z.string(),
    name: z.string()
  })
})
//商品列表
const productsResponseSchema = z.array(createProductResponseSchema)

export type createProductInput = z.infer<typeof createProductSchema>

export const { schemas: productSchemas, $ref } = buildJsonSchemas(
  {
    createProductSchema,
    createProductResponseSchema,
    productsResponseSchema
  },
  {
    $id: 'productSchema'
  }
)
