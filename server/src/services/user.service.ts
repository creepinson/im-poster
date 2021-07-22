import { User, UserDocument } from "../models/user.model.js";
import type { MongooseQueryOptions, FilterQuery } from "mongoose";
import { IUser } from "../types.js";

export const createUser = async (user: IUser) => {
    return User.create(user);
};

export const findUser = async (
    query: FilterQuery<UserDocument>,
    options: MongooseQueryOptions = { lean: true }
) => {
    return User.findOne(query, null, options);
};

export const findUserBy = async (id?: string) => {
    return User.findById(id);
};

export const loginUser = async ({
    username,
    password
}: {
    username: UserDocument["username"];
    password: UserDocument["password"];
}) => {
    const user = await findUser(
        {
            username
        },
        { lean: false }
    );

    if (!user) throw new Error("User does not exist");
    return user.comparePassword(password);
};

export const deleteAllUsers = async () => {
    return User.deleteMany({});
};

export const findAllUsers = async () => {
    return User.find({});
};
