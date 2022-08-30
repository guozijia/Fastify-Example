import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import fastifyJwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import fastifyWebsocket from '@fastify/websocket'
import { withRefResolver } from 'fastify-zod'
import { userSchemas } from './modules/user/user.schema'
import { productSchemas } from './modules/product/product.schema'
import { version } from '../package.json'
import userRoutes from './modules/user/user.route'
import productRoutes from './modules/product/product.route'
import messageRoutes from './modules/message/message.route'

export const app = Fastify({
  //日志
  logger: false
})

app.register(fastifyJwt, {
  secret: 'guozijia'
})

app.register(fastifyWebsocket, {
  // errorHandler: (err, conn, req, reply) => {
  //   console.log(reply)
  // },
  options: {
    maxPayload: 1048576
    // verifyClient: function (info: any, done: any) {
    //   done(true) // the connection is allowed
    // }
  }
})

// app.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {//所有的路由都需要验证token
//   try {
//     await request.jwtVerify()
//   } catch (err) {
//     reply.send(err)
//   }
// })

//将身份验证逻辑包装到一个插件中 可以应用于部分路由
app.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (error) {
    reply.send(error)
  }
})

async function main() {
  for (const schema of [...userSchemas, ...productSchemas]) {
    app.addSchema(schema)
  }

  //注册swagger
  app.register(
    swagger,
    withRefResolver({
      routePrefix: '/docs',
      exposeRoute: true,
      staticCSP: true,
      openapi: {
        info: {
          title: 'Fastify API',
          description: '我的api',
          version
        }
      }
    })
  )
  //注册路由
  app.register(userRoutes, {
    prefix: 'api/user'
  })
  app.register(productRoutes, {
    prefix: '/api/product'
  })
  app.register(messageRoutes, {
    prefix: '/api/message'
  })
  //启动服务
  try {
    await app.listen({ port: 9990 })
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

main()
