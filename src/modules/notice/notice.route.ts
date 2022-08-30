import { FastifyInstance } from 'fastify'
import { noticeHandler } from './notice.controller'

async function NoticeRoutes(app: FastifyInstance) {
  app.get('/', {}, noticeHandler)
}

export default NoticeRoutes
