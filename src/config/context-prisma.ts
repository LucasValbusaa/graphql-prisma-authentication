import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface IContext {
  prisma: PrismaClient;
}

export const context: IContext = { prisma };
