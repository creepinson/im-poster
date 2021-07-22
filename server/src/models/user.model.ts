import type { Document, HookNextFunction } from "mongoose";
import mongoose from "mongoose";
import { argon2id, argon2Verify } from "hash-wasm";
import { IUser } from "../types.js";
import crypto from "crypto";

export interface UserDocument extends IUser, Document {
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    following: {
        type: [String],
        required: true
    },
    joinedAt: {
        type: Date,
        required: true
    },
    avatar: {
        type: String,
        required: false
    }
});

userSchema.pre("save", async function (next: HookNextFunction) {
    if (!this.isModified("password")) return next();

    const salt = crypto.randomBytes(32);
    const hash = await argon2id({
        password: this.password,
        salt,
        parallelism: 1,
        iterations: 256,
        memorySize: 512, // use 512KB memory
        hashLength: 32, // output size = 32 bytes
        outputType: "encoded" // return standard encoded string containing parameters needed to verify the key
    });
    this.password = hash;
    next();
});

userSchema.methods.comparePassword = async function (password: string) {
    const user = this;
    return await argon2Verify({
        password,
        hash: user.password
    });
};

export const User = mongoose.model<UserDocument>("user", userSchema);
