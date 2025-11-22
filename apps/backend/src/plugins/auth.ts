import fastify, { FastifyPluginAsync } from "fastify";
import { authenticateUser } from "../middleware/auth.js";
export const requireAuth: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", authenticateUser);
};
export default requireAuth;
