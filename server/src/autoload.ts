import fp from "fastify-plugin";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import glob from "tiny-glob";
import { dirname } from "dirname-filename-esm";

export default fp(
    async (
        app: FastifyInstance,
        opts: { dir: string; options: FastifyPluginOptions }
    ) => {
        const __dirname = dirname(import.meta);
        const files = await glob("**/*.{ts,js}", {
            cwd: `${__dirname}/${opts.dir}`
        });
        for await (const file of files) {
            const rawImport = await import(
                `./${opts.dir}/${file.replace(".ts", ".js")}`
            );
            await app.register(rawImport.default, opts.options);
        }
    }
);
