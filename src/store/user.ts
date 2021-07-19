import { createStore } from "@logux/state";
import { users, User } from "./db";

export const currentUser = createStore<User>(() => {
    currentUser.set(users[0]);
});
