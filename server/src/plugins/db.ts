import fp from "fastify-plugin";
import mongoose from "mongoose";
import type { FastifyInstance } from "fastify";

declare module "fastify" {
    // eslint-disable-next-line no-shadow
    export interface FastifyInstance {
        db: typeof mongoose;
    }
}

export const migrateUp = async (app: FastifyInstance) => {};

export const migrateDown = async (app: FastifyInstance) => {};

export default fp(
    async (fastify: FastifyInstance, _opts: unknown, next: () => void) => {
        const dbUri =
            process.env.NODE_ENV === "test"
                ? "mongodb://localhost/test"
                : process.env.MONGO_URI;
        if (!dbUri) throw new Error("MONGO_URI is not defined");
        let db: typeof mongoose;
        try {
            db = await mongoose.connect(dbUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                serverSelectionTimeoutMS: 5000
            });
        } catch (e) {
            fastify.log.error(`Unable to connect to database: ${e.message}`);
            process.exit(1);
        }

        fastify.decorate("db", db);

        const migrationsRan = await migrateUp(fastify);
        fastify.log.info({
            migrationsCount: migrationsRan,
            msg: "Succesful migrations run"
        });

        next();
    },
    { name: "db" }
);
