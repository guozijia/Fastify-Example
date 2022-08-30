//typescript 类型

import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const userCore = {
  // email: z
  //   .string({
  //     required_error: 'fuck you',
  //     invalid_type_error: 'must be a string'
  //   })
  //   .email(),
  userName: z.string()
}

const createUserSchema = z.object({
  ...userCore,
  password: z.string()
})

const createUserResponseSchema = z.object({
  id: z.number(),
  ...userCore
})

const loginSchema = z.object({
  ...userCore,
  password: z.string()
})

const loginResponseSchame = z.object({
  token: z.string()
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type loginInput = z.infer<typeof loginSchema>

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchame
  },
  {
    $id: 'userSchema'
  }
)
