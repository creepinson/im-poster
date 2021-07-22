import {
    createUser,
    deleteAllUsers,
    loginUser
} from "../../services/user.service.js";
import { IUser } from "../../types.js";
import { setupTestEnvironment } from "../setupEnv.js";

const fastify = setupTestEnvironment();

beforeEach(async () => {
    await deleteAllUsers();
});

describe("User", () => {
    const userPayload: IUser = {
        username: "test",
        password: "test",
        bio: "Hello world.",
        following: [],
        joinedAt: new Date(),
        name: "Test"
    };

    it("should create a new user", async () => {
        const user = await createUser(userPayload);
        expect(user).toBeDefined();
        expect(user.username).toBe(userPayload.username);
        expect(user.bio).toBe(userPayload.bio);
        expect(user.joinedAt).toBe(userPayload.joinedAt);
        expect(user.name).toBe(userPayload.name);
    });

    it("should login with correct password", async () => {
        const user = await createUser(userPayload);

        const isValid = await loginUser({
            username: user.username,
            password: userPayload.password
        });
        expect(isValid).toBeTruthy();
    });

    it("should fail with incorrect password", async () => {
        const user = await createUser(userPayload);

        const isValid = await loginUser({
            username: user.username,
            password: "wrong"
        });
        expect(isValid).toBeFalsy();
    });
});
