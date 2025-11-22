import { PrismaClient } from "@prisma/client";
import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken } from "../lib/jwt";
const prisma = new PrismaClient();

export interface AuthenticatedUser {
  userId: string;
  githubId: number;
}
declare module "fastify" {
  interface FastifyRequest {
    user?: AuthenticatedUser;
  }
}

export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.code(401).send({ error: "No token provided" });
    }

    const token = authHeader.substring(7);

    const payload = verifyToken(token);

    request.user = {
      userId: payload.userId,
      githubId: parseInt(payload.githubId),
    };
  } catch (error) {
    console.error("Auth error:", error);
    return reply.code(401).send({ error: "Invalid or expired token" });
  }
}
export async function getGitHubAccessToken(
  userId: string
): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { githubAccessToken: true },
  });

  return user?.githubAccessToken || null;
}
