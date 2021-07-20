import fp from "fastify-plugin";
import session from "fastify-secure-session";
import type { FastifyInstance } from "fastify";

export default fp(
    async (fastify: FastifyInstance) => {
        if (!process.env.SESSION_SECRET) {
            fastify.log.error("No SESSION_SECRET environment variable found.");
            process.exit(1);
        }
        // await fastify.register(cookie);
        await fastify.register(session, {
            key: Buffer.from(process.env.SESSION_SECRET, "hex"),
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development"
            }
        });
    },
    { name: "session" }
);
