import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";
import { fetchUserRepos, fetchPullRequests } from "../lib/github.js";
import { buyYes, buyNo, getMarketSummary } from "../lib/lmsr.js";
import { getGitHubAccessToken, authenticateUser } from "../middleware/auth.js";

const prisma = new PrismaClient();

const githubRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", authenticateUser);

  fastify.get("/github/repos", async (request, reply) => {
    const accessToken = await getGitHubAccessToken(request.user!.userId);

    if (!accessToken) {
      return reply.code(400).send({
        error: "GitHub access token not found. Please re-authenticate.",
      });
    }

    try {
      const repos = await fetchUserRepos(accessToken);
      return { repos };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({
        error: "Failed to fetch repos from GitHub",
        details: err instanceof Error ? err.message : "Unknown error",
      });
    }
  });

  fastify.post("/repos", async (request, reply) => {
    const { repoIds } = request.body as { repoIds: number[] };

    if (!repoIds || !Array.isArray(repoIds)) {
      return reply.code(400).send({ error: "repoIds must be an array" });
    }
    return reply.send({ message: "Repos saved", repoIds });
  });

  fastify.post("/sync/prs", async (request, reply) => {
    const accessToken = await getGitHubAccessToken(request.user!.userId);

    if (!accessToken) {
      return reply.code(400).send({ error: "GitHub access token not found" });
    }

    return reply.send({ message: "PRs synced" });
  });
};

export default githubRoutes;
