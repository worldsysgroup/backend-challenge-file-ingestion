import fastify from "fastify";
import cors from "@fastify/cors";
import { corsOptions } from "./config/cors.options";
import rateLimit from "@fastify/rate-limit";
import { rateLimitOptions } from "./config/rateLimit.options";
import { logger } from "./utils/logger.instance";

const server = fastify({ logger })

server.register(cors, corsOptions)
server.register(rateLimit, rateLimitOptions)




