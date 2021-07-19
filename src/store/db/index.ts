import dayjs from "dayjs";

export interface User {
    username: string;
    name?: string;
    avatar?: string;
    bio: string;
    following: string[];
    joinedAt: Date;
}

export interface Post {
    username: string;
    content: string;
}

export const users: User[] = [
    {
        username: "Creepinson101",
        name: "Theo Paris",
        avatar: "https://pbs.twimg.com/profile_images/1235369568719097856/bTpuzXiS_400x400.jpg",
        bio: "I'm a 16 year old gamer, programmer, and music producer. You might know me as Creepinson.",
        following: ["elonmusk"],
        joinedAt: dayjs().year(2013).month(10).toDate()
    },
    {
        username: "elonmusk",
        name: "Elon Musk",
        avatar: "https://pbs.twimg.com/profile_images/1416443682157473795/dGtFbtht_400x400.jpg",
        bio: "meme necromancy while u wait",
        following: [],
        joinedAt: dayjs().year(2009).month(6).toDate()
    }
];
export const posts: Post[] = [
    {
        username: "Creepinson101",
        content: "Welcome to my twitter clone."
    },
    {
        username: "elonmusk",
        content:
            "Solar + Powerwall battery ensures that your home never loses power"
    }
];
