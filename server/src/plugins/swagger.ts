import fp from "fastify-plugin";
import fastifySwagger from "fastify-swagger";

export default fp(
    async (fastify) => {
        await fastify.register(fastifySwagger, {
            routePrefix: "/swagger",
            swagger: {
                info: {
                    title: "ImPoster API",
                    description: "Imposter API",
                    version: "0.0.1"
                },
                host: "localhost:8000",
                schemes: ["http"],
                consumes: ["application/json"],
                produces: ["application/json"]
            },
            uiConfig: {
                docExpansion: "full",
                deepLinking: false
            },
            staticCSP: false,
            exposeRoute: true
        });
    },
    { name: "swaggger" }
);
