import fastify, { FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import dotenv from "dotenv";
import cors from "fastify-cors";
import autoload from "./autoload.js";

export const core = fp(
    async (app, opts: FastifyPluginOptions) => {
        dotenv.config();

        // Declare a route
        app.get("/", async () => ({ hello: "world" }));

        await app.register(cors, {
            origin: "*"
        });

        await app.register(autoload, {
            dir: "plugins",
            options: { ...opts }
        });
        await app.register(autoload, {
            dir: "routes",
            options: { ...opts }
        });
    },
    { name: "core" }
);

// Run the server!
export const start = async () => {
    const server = fastify({
        logger: {
            prettyPrint: {
                translateTime: true,
                ignore: "hostname"
            }
        }
    });

    await server.register(core);

    try {
        await server.listen(process.env.PORT ?? 8000);
        // server.log.info()
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
