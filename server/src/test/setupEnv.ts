import fastify from "fastify";
import { core } from "../index.js";
import { migrateDown, migrateUp } from "../plugins/db.js";
// import { testEvents } from "@toes/toest";

export const setupTestEnvironment = () => {
    const server = fastify({
        logger: {
            level: process.env.LOG_LEVEL || "silent",
            prettyPrint: true
        },
        pluginTimeout: 2 * 60 * 1000
    });

    beforeAll(async () => {
        await server.register(core);
        await server.ready();
    });

    beforeEach(async () => {
        await migrateDown(server);
        await migrateUp(server);
    });

    afterAll(async () => {
        await server.db.disconnect();
        await server.close();
    });

    return server;
};
