export interface User {
    id: string;
    username: string;
    password: string;
    name: string;
    avatar?: string;
    bio: string;
    following: string[];
    joinedAt: Date;
}

export interface Post {
    id: string;
    user: string;
    content: string;
    likes: string[];
}
