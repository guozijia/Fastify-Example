import { hashPassword } from '../../utils/hash'
import prisma from '../../utils/prisma'
import { CreateUserInput } from './user.schema'

export const createUser = async (input: CreateUserInput) => {
  const { password, ...rest } = input
  const { hash, salt } = hashPassword(password)
  //在数据库创建
  const user = prisma.user.create({
    data: { ...rest, salt, password: hash }
  })
  return user
}

export const findUserByEmail = async (userName: string) => {
  return prisma.user.findUnique({
    where: {
      userName
    }
  })
}

export const findUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      userName: true
    }
  })
}
