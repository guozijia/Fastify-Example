import { FastifyInstance } from 'fastify'
import { FastifyJWT } from '@fastify/jwt'
declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: any
  }
}
declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      id: number
      email: string
      name: string
    }
  }
}
