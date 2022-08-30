import { FastifyReply, FastifyRequest } from 'fastify'
import { app } from '../../app_io'

export const messageHandler = (request: FastifyRequest, reply: FastifyReply) => {
  app.io.emit('hello', {
    name: 'sadsads'
  })
  const { redis } = app
  console.log(redis.info())

  reply.code(201).send('ok12321')
}
