import { FastifyPluginAsync } from "fastify";
import { argon2Verify } from "hash-wasm";
import { IUser } from "../types.js";
import {
    createUser,
    findAllUsers,
    findUser,
    findUserBy
} from "../services/user.service.js";

const userService: FastifyPluginAsync = async (app) => {
    app.route<{ Body: { username: string; password: string } }>({
        method: "POST",
        url: "/users",
        schema: {
            body: {
                type: "object",
                required: ["username", "password"],
                properties: {
                    username: { type: "string" },
                    password: { type: "string" }
                }
            },
            response: {
                409: {
                    type: "object",
                    required: ["error"],
                    properties: {
                        error: { type: "string", const: "Username is taken." }
                    }
                },
                201: {
                    type: "object",
                    required: [""],
                    properties: {
                        username: {
                            type: "string"
                        },
                        name: {
                            type: "string"
                        },
                        bio: {
                            type: "string"
                        },
                        following: { type: "array", items: { type: "string" } },
                        joinedAt: { type: "string" },
                        _id: {
                            type: "string"
                        }
                    }
                }
            }
        },
        handler: async (req, res) => {
            const { username, password } = req.body;
            try {
                const userData: IUser = {
                    username,
                    name: username,
                    password,
                    joinedAt: new Date(),
                    following: [],
                    bio: "Hello world."
                };

                const finalUser = await createUser(userData);

                // app.log.debug(finalUser);

                return res
                    .status(201)
                    .send({ ...finalUser, password: undefined });
            } catch (error) {
                if (error.code === 11000)
                    return res
                        .status(409)
                        .send({ error: "Username is taken." });
                app.log.error(error);
                return res.status(500).send({
                    error: "Failed to complete signup"
                });
            }
        }
    });

    app.route<{ Body: { username: string; password: string } }>({
        method: "POST",
        url: "/login",
        schema: {
            body: {
                type: "object",
                required: ["username", "password"],
                properties: {
                    username: { type: "string" },
                    password: { type: "string" }
                }
            },
            response: {
                500: {
                    type: "object",
                    required: ["error"],
                    properties: {
                        error: { type: "string" },
                        details: { type: "string" }
                    }
                },
                404: {
                    type: "object",
                    required: ["error"],
                    properties: {
                        error: { type: "string" }
                    }
                },
                400: {
                    type: "object",
                    required: ["error"],
                    properties: {
                        error: { type: "string" }
                    }
                },
                200: {
                    type: "object",
                    required: ["userId", "token"],
                    properties: {
                        userId: { type: "string" },
                        token: { type: "string" }
                    }
                }
            }
        },
        handler: async (req, res) => {
            try {
                const { username, password } = req.body;
                const user = await findUser({
                    username
                });
                if (!user) {
                    return res.status(404).send({
                        error: "User not found"
                    });
                }

                const isValidPassword = await argon2Verify({
                    password,
                    hash: user.password
                });

                if (!isValidPassword)
                    return res.status(400).send({
                        error: "Invalid password"
                    });

                const token = await res.jwtSign({ id: user._id });
                return res.status(200).send({
                    userId: user._id,
                    token
                });
            } catch (err) {
                app.log.error(err);
                return res.status(500).send({
                    error: "Failed to complete login",
                    details: err.message
                });
            }
        }
    });

    app.get(
        "/profile",
        { preValidation: app.authenticate },
        async (req, res) => {
            try {
                const userId: string | undefined = req.user.id;
                console.log(userId);
                const user = await findUserBy(userId);
                return res.status(200).send({ ...user?.toJSON(), password: undefined });
            } catch (err) {
                return res.status(401).send({
                    error: "You must be logged in to view this resource."
                });
            }
        }
    );

    app.get<{
        Params: {
            userId?: string;
        };
        Response: {
            401: {
                type: "object";
                required: ["error"];
                properties: {
                    error: string;
                };
            };
            200: {
                type: "array";
                items: {
                    type: "object";
                    required: ["_id"];
                    properties: {
                        username: {
                            type: "string";
                        };
                        name: {
                            type: "string";
                        };
                        bio: {
                            type: "string";
                        };
                        following: { type: "array"; items: { type: "string" } };
                        joinedAt: { type: "string" };
                        _id: {
                            type: "string";
                        };
                    };
                };
            };
        };
    }>("/profiles", async (req, res) => {
        try {
            const users = await findAllUsers();

            return res.status(200).send(
                users.map((u) => ({
                    ...u.toJSON(),
                    password: undefined
                }))
            );
        } catch (err) {
            return res.status(401).send({
                error: "You must be logged in to view this resource."
            });
        }
    });
};

export default userService;
