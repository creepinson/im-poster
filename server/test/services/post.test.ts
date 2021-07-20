import { setupTestEnvironment } from "../setupEnv.js";

const fastify = setupTestEnvironment();

test("should log in a user and create post", async () => {
    const user = { username: "test", password: "test" };

    await fastify.inject({
        url: "/users",
        method: "POST",
        payload: user
    });

    const login = await fastify.inject({
        url: "/login",
        method: "POST",
        payload: user
    });

    expect(login.statusCode).toBe(200);

    const cookie = login.headers["set-cookie"];
    fastify.log.debug(cookie);

    const post = await fastify.inject({
        url: "/posts",
        method: "POST",
        headers: { cookie },
        payload: {
            content: "Hello world!"
        }
    });

    expect(post.statusCode).toBe(201);
    expect(post.json().id).toBeDefined();
    expect(post.json().id).not.toBeNull();
});
