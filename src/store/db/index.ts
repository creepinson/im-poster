export interface User {
    username: string;
    avatar?: string;
}

export interface Post {
    username: string;
    content: string;
}

export const users: User[] = [
    {
        username: "Creepinson101",
        avatar: "https://pbs.twimg.com/profile_images/1235369568719097856/bTpuzXiS_400x400.jpg"
    }
];
export const posts: Post[] = [
    {
        username: "Creepinson101",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
    }
];
