import { User } from "../../src/types.js";
import { setupTestEnvironment } from "../setupEnv.js";

const fastify = setupTestEnvironment();

describe("User", () => {
    test("should sign up a user", async () => {
        const user = { username: "test", password: "test" };

        const signup = await fastify.inject({
            url: "/users",
            method: "POST",
            payload: user
        });

        expect(signup.statusCode).toBe(201);
        expect(signup.json<User>().username).toBe(user.username);
    });

    test("should log in a user and access user profile", async () => {
        const user = { username: "test", password: "test" };

        const signup = await fastify.inject({
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

        const profile = await fastify.inject({
            url: "/profile",
            method: "GET",
            headers: { cookie }
        });

        expect(profile.statusCode).toBe(200);
        expect(profile.json().id).toBe(signup.json().id);
        expect(profile.json().username).toBe(signup.json().username);
    });
});
