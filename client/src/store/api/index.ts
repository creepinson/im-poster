import axios from "axios";

export interface User {
    id: string;
    username: string;
    name: string;
    avatar?: string;
    bio: string;
    following: string[];
    joinedAt: Date;
    posts: Post[];
}

export interface Post {
    id: string;
    user: string;
    content: string;
    likes: string[];
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

const api = axios.create({
    baseURL: import.meta.env.VITE_API ? import.meta.env.VITE_API.toString() : ""
});

export const getProfiles = async () => {
    const res = await api.get<User[]>("/profiles");
    return res.data;
};

export const getPosts = async () => {
    const res = await api.get<Post[]>("/posts");
    return res.data;
};

export const login = async () => {
    const res = await api.get("/login");
    return res.data;
};
