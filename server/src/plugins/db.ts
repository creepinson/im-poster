import fp from "fastify-plugin";
import knex, { Knex } from "knex";
import type { FastifyInstance } from "fastify";

declare module "fastify" {
    // eslint-disable-next-line no-shadow
    export interface FastifyInstance {
        db: Knex;
    }
}

export const migrateUp = async (app: FastifyInstance) => {
    if (!(await app.db.schema.hasTable("users")))
        await app.db.schema.createTable(
            "users",
            (table: Knex.CreateTableBuilder) => {
                table.text("id").primary().unique().notNullable();

                table.string("username", 255).unique().notNullable();
                table.string("password", 255).notNullable();
                table.string("name", 255).notNullable();
                table.string("avatar", 255);
                table.string("bio", 255).notNullable();
                table.json("following").notNullable();

                table.timestamp("joinedAt").defaultTo(app.db.fn.now());
            }
        );

    if (!(await app.db.schema.hasTable("posts")))
        await app.db.schema.createTable(
            "posts",
            (table: Knex.CreateTableBuilder) => {
                table.text("id").primary().unique().notNullable();

                table.text("user").notNullable();
                table.text("content").notNullable();
                table.json("likes").notNullable();
            }
        );
};

export const migrateDown = async (app: FastifyInstance) => {
    await app.db.schema.dropTableIfExists("users");
    await app.db.schema.dropTableIfExists("posts");
};

export default fp(
    async (fastify: FastifyInstance, _opts: unknown, next: () => void) => {
        const dbUri = process.env.POSTGRES_URI;
        if (!dbUri) throw new Error("POSTGRES_URI is not defined");

        const db = knex({
            client: "pg",
            connection: dbUri
        });

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
