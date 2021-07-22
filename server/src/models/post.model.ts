import type { Document, HookNextFunction } from "mongoose";
import mongoose from "mongoose";
import { IPost } from "../types.js";

export interface PostDocument extends IPost, Document {}

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true
    },
    likes: {
        type: [
            {
                type: String
            }
        ],
        default: []
    }
});

export const Post = mongoose.model<PostDocument>("Post", postSchema);
