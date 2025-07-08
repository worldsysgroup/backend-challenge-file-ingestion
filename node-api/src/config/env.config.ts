import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    // environment
    APP_ENV: z.enum(["development", "production"]).default("development").describe("The environment to run the server on"),
    PORT: z.coerce.number().default(8000).describe("The port to run the server on"),
    ALLOWED_ORIGINS: z.string().transform((val) => val.split(",").map((origin) => origin.trim()).filter(Boolean)).describe("The allowed origins of the server"),

    // logging
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info").describe("The level of logging to use"),

    // database
    DATABASE_URL: z.string().describe("The URL of the database to connect to"),
  },
  runtimeEnvStrict: {
    APP_ENV: process.env.APP_ENV,
    PORT: process.env.PORT,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    LOG_LEVEL: process.env.LOG_LEVEL,
    DATABASE_URL: process.env.DATABASE_URL,
  },
});