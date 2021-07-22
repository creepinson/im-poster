import fp from "fastify-plugin";
import jwt from "fastify-jwt";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
    export interface FastifyInstance {
        authenticate: (
            request: FastifyRequest,
            reply: FastifyReply
        ) => Promise<void>;
    }
}

declare module "fastify-jwt" {
    interface FastifyJWT {
        payload: { id: string };
    }
}

export default fp(
    async (fastify: FastifyInstance) => {
        if (!process.env.JWT_SECRET) {
            fastify.log.error("No JWT_SECRET environment variable found.");
            process.exit(1);
        }
        await fastify.register(jwt, {
            secret: process.env.JWT_SECRET ?? "secret69420"
        });

        fastify.decorate(
            "authenticate",
            async (req: FastifyRequest, res: FastifyReply) => {
                try {
                    await req.jwtVerify();
                } catch (err) {
                    return res.status(401).send({
                        error: "You must be logged in to access this resource"
                    });
                }
            }
        );
    },
    { name: "session" }
);
