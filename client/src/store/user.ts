import { createStore } from "@logux/state";
import { getProfiles, User } from "./api";

export const currentUser = createStore<User>(() => {
    getProfiles().then((users) => {
        const creepinson = users.find((u) => u.username === "Creepinson101");
        if (creepinson) currentUser.set(creepinson);
    });
});
