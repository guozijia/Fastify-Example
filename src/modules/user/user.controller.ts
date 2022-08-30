import { FastifyReply, FastifyRequest } from 'fastify'
import { app } from '../../app_io'
import { verifyPassword } from '../../utils/hash'
import { CreateUserInput, loginInput } from './user.schema'
import { createUser, findUserByEmail, findUsers } from './user.server'

export async function userRegisterHandler(
  request: FastifyRequest<{
    Body: CreateUserInput
  }>,
  reply: FastifyReply
) {
  const body = request.body
  try {
    const user = await createUser(body)
    return reply.code(201).send(user)
  } catch (error) {
    return reply.code(500).send(error)
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: loginInput
  }>,
  reply: FastifyReply
) {
  const body = request.body
  //找到当前用户
  const user = await findUserByEmail(body.userName)
  if (!user) {
    return reply.code(401).send({
      message: '该用户不存在！'
    })
  }
  //验证密码
  const correctPassword = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password
  })

  //创建token
  if (correctPassword) {
    const { password, salt, ...rest } = user
    //返回请求
    return { token: app.jwt.sign(rest) }
  } else {
    return reply.code(401).send({
      message: '密码错误！'
    })
  }
}

export async function getUsersHandler(request: FastifyRequest, reply: FastifyReply) {
  return await findUsers()
}
