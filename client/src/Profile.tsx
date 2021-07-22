import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { User, getProfiles, getPosts } from "./api";

export const Profile = (props: { username: string }) => {
    const [user, setUser] = useState<User>();

    useEffect(() => {
        getProfiles().then((users) => {
            const u = users?.find((u) => u.username === props.username);
            if (u) {
                getPosts(u.username)
                    .then((posts) => {
                        setUser({
                            ...u,
                            followers:
                                users?.filter((us) =>
                                    us.following.includes(u.username)
                                ) ?? [],
                            posts: posts ?? []
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        setUser(u);
                    });
            }
        });
    }, [props.username]);

    return user ? (
        <div className="p-4 w-full">
            <div className="w-full border-b-2 border-gray-600 mb-6">
                <div className="w-24">
                    <img className="mb-2 rounded-full" src={user.avatar} />
                </div>
                <h3 className="font-bold text-xl">{user.name}</h3>
                <h4 className="text-xl text-gray-400">@{user.username}</h4>
                <p className="text-md">{user.bio}</p>
                <small className="text-gray-400 text-md">
                    Joined {dayjs(user.joinedAt).format("M YYYY")}
                </small>
                <div className="flex flex-row justify-start items-center text-lg">
                    <small className="text-gray-400 mr-2">
                        <span className="text-white font-bold mr-1">
                            {user.followers.length === 1
                                ? `${user.followers.length}`
                                : `${user.followers.length}`}
                        </span>
                        {user.followers.length === 1 ? "Follower" : "Followers"}
                    </small>
                    <small className="text-gray-400 mr-4">
                        <span className="text-white font-bold mr-1">
                            {user.following.length === 1
                                ? `${user.following.length}`
                                : `${user.following.length}`}
                        </span>
                        {user.following.length === 1
                            ? "Following"
                            : "Following"}
                    </small>
                    <small className="text-gray-400 mr-4">
                        <span className="text-white font-bold mr-1">
                            {user.posts.length}
                        </span>
                        {user.posts.length === 1 ? " Post" : " Posts"}
                    </small>
                </div>
            </div>
            <h2 className="font-bold text-xl"></h2>
        </div>
    ) : (
        <div className="font-bold text-xl">
            <h3>User Not Found</h3>
        </div>
    );
};
