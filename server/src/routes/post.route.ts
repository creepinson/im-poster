import { FastifyPluginAsync } from "fastify";
import { Post } from "../models/post.model.js";

const postService: FastifyPluginAsync = async (app) => {
    app.get("/posts", async (req, res) => {
        const posts = await Post.find({});
        return res.send(posts);
    });

    app.post<{
        Schema: {
            body: {
                type: "object";
                required: ["_id"];
                properties: {
                    _id: {
                        type: "string";
                    };
                };
            };
        };
        Body: {
            content: string;
        };
    }>("/posts", { preValidation: app.authenticate }, async (req, res) => {
        const userId = req.user.id;

        const post = await Post.create({
            user: userId,
            content: req.body.content,
            likes: []
        });

        return res.status(201).send({
            ...post.toJSON()
        });
    });
};

export default postService;
