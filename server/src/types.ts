export interface IUser {
    username: string;
    password: string;
    name: string;
    avatar?: string;
    bio: string;
    following: string[];
    joinedAt: Date;
}

export interface IPost {
    user: string;
    content: string;
    likes: string[];
}
