import { FastifyPluginAsync } from "fastify";
import { signToken } from "../lib/jwt.js";
import { Prisma, PrismaClient } from "@prisma/client";
import "dotenv/config";
const prisma = new PrismaClient();
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL =
  process.env.GITHUB_CALLBACK_URL ||
  "http://localhost:3001/auth/github/callback";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/auth/github", async (request, reply) => {
    if (!GITHUB_CLIENT_ID) {
      return reply.code(500).send({ error: "GitHub OAuth not configured" });
    }

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      GITHUB_CALLBACK_URL
    )}&scope=read:user,user:email,repo`;

    return reply.redirect(githubAuthUrl);
  });

  fastify.get("/auth/github/callback", async (request, reply) => {
    const { code } = request.query as { code?: string };

    if (!code) {
      return reply.redirect(`${FRONTEND_URL}?error=no_code`);
    }

    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
      return reply.redirect(`${FRONTEND_URL}?error=oauth_not_configured`);
    }

    try {
      const tokenResponse = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code,
          }),
        }
      );

      const tokenData = (await tokenResponse.json()) as {
        access_token?: string;
        error?: string;
      };
      const accessToken = tokenData.access_token;

      if (!accessToken) {
        return reply.redirect(`${FRONTEND_URL}?error=token_exchange_failed`);
      }

      const userResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      const githubUser = (await userResponse.json()) as {
        id: number;
        login: string;
        name: string | null;
        avatar_url: string | null;
      };

      const user = await prisma.user.upsert({
        where: { githubId: githubUser.id },
        update: {
          githubLogin: githubUser.login,
          name: githubUser.name || null,
          avatarUrl: githubUser.avatar_url || null,
          githubAccessToken: accessToken,
        },
        create: {
          githubId: githubUser.id,
          githubLogin: githubUser.login,
          name: githubUser.name || null,
          avatarUrl: githubUser.avatar_url || null,
          githubAccessToken: accessToken,
        },
      });

      await prisma.balance.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          balance: 1000,
        },
      });

      const token = signToken({
        userId: user.id,
        githubId: user.githubId.toString(),
      });

      return reply.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
    } catch (error) {
      fastify.log.error(error);
      return reply.redirect(`${FRONTEND_URL}/auth/callback?error=${error}`);
    }
  });
};

export default authRoutes;
