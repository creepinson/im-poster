import { FastifyPluginAsync } from "fastify";
import { argon2id, argon2Verify } from "hash-wasm";
import { User } from "../types.js";
import crypto from "crypto";
import { nanoid } from "nanoid";

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
                500: {
                    type: "object",
                    required: ["error"],
                    properties: {
                        error: { type: "string" }
                    }
                },
                201: {
                    type: "object",
                    required: [
                        "username",
                        "id",
                        "name",
                        "bio",
                        "following",
                        "joinedAt"
                    ],
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
                        id: {
                            type: "number"
                        }
                    }
                }
            }
        },
        handler: async (req, res) => {
            const { username, password } = req.body;
            try {
                const salt = crypto.randomBytes(16);
                const hashedPassword = await argon2id({
                    password,
                    salt,
                    parallelism: 1,
                    iterations: 256,
                    memorySize: 512, // use 512KB memory
                    hashLength: 32, // output size = 32 bytes
                    outputType: "encoded" // return standard encoded string containing parameters needed to verify the key
                });

                const userData: Partial<User> = {
                    id: nanoid(32),
                    username,
                    name: username,
                    password: hashedPassword,
                    joinedAt: new Date(),
                    following: [],
                    bio: "Hello world."
                };

                await app.db
                    .insert({
                        ...userData,
                        following: JSON.stringify(userData.following)
                    })
                    .into<User>("users");

                const finalUser = (await app
                    .db<User>("users")
                    .select()
                    .where("username", userData.username)
                    .first()) as Partial<User>;
                delete finalUser.password;

                // app.log.debug(finalUser);

                return res.status(201).send(finalUser);
            } catch (error) {
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
                    required: ["userId"],
                    properties: {
                        userId: { type: "string" }
                    }
                }
            }
        },
        handler: async (req, res) => {
            try {
                const { username, password } = req.body;
                const user = await app
                    .db<User>("users")
                    .select()
                    .where("username", "=", username)
                    .first();
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

                req.session.set("userId", user.id);
                return res.status(200).send({
                    userId: user.id
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

    app.get("/profile", async (req, res) => {
        try {
            const userId: string | undefined = req.session.get("userId");
            const user = await app
                .db<User>("users")
                .select(
                    "username",
                    "avatar",
                    "id",
                    "bio",
                    "following",
                    "joinedAt",
                    "name"
                )
                .where("id", userId)
                .first();
            return res.status(200).send(user);
        } catch (err) {
            return res.status(401).send({
                error: "You must be logged in to view this resource."
            });
        }
    });

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
                    required: [
                        "username",
                        "id",
                        "name",
                        "bio",
                        "following",
                        "joinedAt"
                    ];
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
                        id: {
                            type: "number";
                        };
                    };
                };
            };
        };
    }>("/profiles", async (req, res) => {
        try {
            const users = await app
                .db<User>("users")
                .select(
                    "username",
                    "avatar",
                    "id",
                    "bio",
                    "following",
                    "joinedAt",
                    "name"
                );
            return res.status(200).send(users);
        } catch (err) {
            return res.status(401).send({
                error: "You must be logged in to view this resource."
            });
        }
    });
};

export default userService;
