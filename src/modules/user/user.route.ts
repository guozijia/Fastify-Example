import { FastifyInstance } from 'fastify'
import { loginHandler, userRegisterHandler, getUsersHandler } from './user.controller'
import { $ref } from './user.schema'

async function userRoutes(app: FastifyInstance) {
  app.post(
    '/register',
    //中间件
    {
      schema: {
        //请求验证
        body: $ref('createUserSchema'),
        //响应验证
        response: {
          201: $ref('createUserResponseSchema')
        }
      }
    },
    userRegisterHandler
  )
  app.post(
    '/login',
    {
      schema: {
        body: $ref('loginSchema'),
        response: {
          200: $ref('loginResponseSchame')
        }
      }
    },
    loginHandler
  )
  app.get(
    '/',
    {
      onRequest: [app.authenticate]
    },
    getUsersHandler
  )
}

export default userRoutes
