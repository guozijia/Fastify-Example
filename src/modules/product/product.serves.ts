import prisma from '../../utils/prisma'
import { createProductInput } from './product.schema'

export const createProduct = async (input: createProductInput & { ownerId: number }) => {
  return prisma.product.create({
    data: input
  })
}

export const getProducts = async () => {
  return prisma.product.findMany({
    select: {
      title: true,
      content: true,
      price: true,
      id: true,
      ownerId: true,
      updatedAt: true,
      createdAt: true,
      owner: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })
}
