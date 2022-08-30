import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import fastifyJwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import { withRefResolver } from 'fastify-zod'
import fastifyIo from 'fastify-socket.io'
import fastifyRedis from '@fastify/redis'
//project
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
app.register(fastifyRedis, { host: '127.0.0.1' })

app.register(fastifyIo, {
  cors: {
    origin: 'http://localhost:8080'
  }
})

app.register(fastifyJwt, {
  secret: 'guozijia'
})

let users: string[] = []

const addUserHandler = (id: string) => {
  users.push(id)
}

const removeUserHandler = (id: string) => {
  users = users.filter((item) => item !== id)
}

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
    prefix: 'api/product'
  })
  app.register(messageRoutes, {
    prefix: 'api/message'
  })

  app.ready().then(() => {
    const getOnlineCountHandler = () => {
      app.io.emit('getOnlineCount', {
        //io和socket区别----> io：发送给所有在线的，socket:发送给当前连接的
        msg: 'Hello Kstar!!!',
        online: users.length
      })
    }
    app.io.on('connection', (socket) => {
      addUserHandler(socket.id)
      //获取当前在线数量
      getOnlineCountHandler()

      socket.on('clientMessage', (data) => {
        const { index, msg } = data
        //如果id为自己，则接收不到消息
        socket.to([users[index], users[index + 1]]).emit('getUserNotice', msg)
      })

      socket.on('disconnect', () => {
        removeUserHandler(socket.id)
      })
    })
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
