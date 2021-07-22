import axios, { AxiosError } from "axios";
import { ApiAuthorizationScheme, createClient } from "@etsoo/restclient";
import { Store } from "pullstate";

export interface User {
    _id: string;
    username: string;
    name: string;
    avatar?: string;
    bio: string;
    following: string[];
    joinedAt: Date;
    posts: Post[];
    followers: User[];
}

export interface Post {
    id: string;
    user: string;
    content: string;
    likes: string[];
    username?: string;
}

/* export const users: User[] = [
    {
        username: "Creepinson101",
        name: "Theo Paris",
        avatar: "https://pbs.twimg.com/profile_images/1235369568719097856/bTpuzXiS_400x400.jpg",
        bio: "I'm a 16 year old gamer, programmer, and music producer. You might know me as Creepinson.",
        following: ["elonmusk"],
        joinedAt: dayjs().year(2013).month(10).toDate()
    }
];
 */

const api = createClient();
api.baseUrl = import.meta.env.VITE_API
    ? import.meta.env.VITE_API.toString()
    : "http://localhost:8000";

export const getProfiles = async () => {
    const res = await api.get<User[]>("/profiles");
    return res;
};

export const getPosts = async (username?: string) => {
    return await api.get<Post[]>(
        username ? `/posts?username=${username}` : "/posts"
    );
};

export const signup = async (data: { username: string; password: string }) => {
    return await api.post<User[]>("/users", data);
};

export const login = async (data: { username: string; password: string }) => {
    const res = await api.post<{ userId: string; token: string }>(
        "/login",
        data
    );
    if (res?.token) localStorage.setItem("token", res.token);
    return res;
};

export const isAxiosError = <T>(err: unknown): err is AxiosError<T> =>
    typeof (err as Record<string, unknown>).response !== "undefined";

export const authStore = new Store<{ token: string; user?: User | undefined }>({
    token: ""
});

export const auth = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token is not defined in localStorage!");
    api.authorize(ApiAuthorizationScheme.Bearer, token);
};

export const getProfile = async () => {
    return await api.get<User>("/profile");
};
