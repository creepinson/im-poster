import { FastifyPluginAsync } from "fastify";
import { isLoggedIn } from "../middleware/login.js";
import { Post } from "../types.js";
import { nanoid } from "nanoid";

const postService: FastifyPluginAsync = async (app) => {
    app.get("/posts", async (req, res) => {
        const posts = await app.db<Post>("posts").select();
        res.send(posts);
    });

    app.post<{
        Schema: {
            body: {
                type: "object";
                properties: {
                    content: {
                        type: "string";
                    };
                };
            };
        };
        Body: {
            content: string;
        };
    }>("/posts", { preHandler: isLoggedIn }, async (req, res) => {
        const userId = req.session.get("userId");

        const id = await app.db
            .into<Post>("posts")
            .insert({
                id: nanoid(32),
                user: userId,
                content: req.body.content,
                likes: []
            })
            .returning("id")
            .first();

        return res.status(201).send({
            id
        });
    });
};

export default postService;
