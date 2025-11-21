import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaPlugin: FastifyPluginAsync = async (fastify) => {
  const prisma = new PrismaClient();

  fastify.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  fastify.decorate("prisma", prisma);
};

export default prismaPlugin;
