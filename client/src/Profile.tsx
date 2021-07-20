import { blinq } from "blinq";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { getPosts, User, getUsers } from "./store/api";

export const Profile = (props: { username: string }) => {
    const [user, setUser] = useState<User>();

    useEffect(() => {
        getUsers().then((users) =>
            setUser(
                blinq(users)
                    .where((u) => u.username === props.username)
                    .first()
            )
        );
    }, [props.username]);

    const userFollowing = user ? blinq(user.following).count() : 0;

    return user ? (
        <div className="p-4 col-span-6 md:col-span-8 lg:col-span-10">
            <div className="md:row-span-3 flex flex-col justify-start items-start py-2 mb-4 border-b-2 border-gray-600">
                <h2 className="font-bold text-xl">{user.username}</h2>
                <h2 className="font-bold text-xl">
                    {userPosts === 1
                        ? `${userPosts} Post`
                        : `${userPosts} Posts`}
                </h2>
            </div>
            <div className="">
                <div className="w-24">
                    <img
                        className="mb-2 rounded-full"
                        src={user.avatar}
                        alt={user.username}
                    />
                </div>
                <h3 className="font-bold text-xl">{user.name}</h3>
                <h4 className="text-xl text-gray-400">@{user.username}</h4>
                <p className="text-lg">{user.bio}</p>
                <small className="text-gray-400 text-lm">
                    Joined {dayjs(user.joinedAt).format("M YYYY")}
                </small>
                <div className="flex flex-row justify-start items-center text-lg">
                    <small className="text-gray-400 mr-2">
                        <span className="text-white font-bold mr-1">
                            {userFollowers === 1
                                ? `${userFollowers}`
                                : `${userFollowers}`}
                        </span>
                        {userFollowers === 1 ? "Follower" : "Followers"}
                    </small>
                    <small className="text-gray-400 mr-4">
                        <span className="text-white font-bold mr-1">
                            {userFollowing === 1
                                ? `${userFollowing}`
                                : `${userFollowing}`}
                        </span>
                        {userFollowing === 1 ? "Following" : "Following"}
                    </small>
                </div>
            </div>
        </div>
    ) : (
        <div className="font-bold text-xl">
            <h3>User Not Found</h3>
        </div>
    );
};
