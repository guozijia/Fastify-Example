import { FastifyInstance } from 'fastify'
import { messageHandler } from './message.controller'

async function messageRoutes(app: FastifyInstance) {
  app.get('/', messageHandler)
}

export default messageRoutes
