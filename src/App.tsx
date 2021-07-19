import React, { useState, ReactNode, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Route, Router } from "wouter";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faHashtag, faHome, faUser } from "@fortawesome/free-solid-svg-icons";
import { useStore } from "@logux/state/react";
import { currentUser } from "./store/user";
import { posts, Post, users } from "./store/db";
import { blinq } from "blinq";
import { Profile } from "./Profile";

export const App = () => {
    const user = useStore(currentUser);
    const [currentPosts, setCurrentPosts] = useState<Post[]>([]);

    const [links, setLinks] = useState<
        { href: string; content: ReactNode; name: string }[]
    >([]);

    useEffect(() => {
        setLinks([
            {
                href: "/",
                name: "Home",
                content: <FontAwesomeIcon icon={faHome} size="2x" />
            },
            {
                href: "#",
                name: "Explore",
                content: <FontAwesomeIcon icon={faHashtag} size="2x" />
            },
            {
                href: `/${user.username}`,
                name: "Profile",
                content: (
                    <FontAwesomeIcon icon={faUser} className="" size="2x" />
                )
            }
        ]);
    }, [user]);

    const postsPerPage = 10;

    useEffect(() => {
        setCurrentPosts(
            blinq(posts)
                .takeWhile((_x, i) => i < postsPerPage)
                .toArray()
        );
    }, []);

    return (
        <div className="bg-gray-800 text-white grid md:grid-cols-12 min-h-screen">
            <nav
                className="md:col-span-1 mt-2 border-r-2 gap-4 border-gray-600"
                aria-label="Navigation"
            >
                <div className="p-4 rounded-full flex flex-col justify-start items-center">
                    <FontAwesomeIcon
                        aria-label="Twitter Logo"
                        icon={faTwitter}
                        size="2x"
                    />
                </div>
                {links.map((l) => (
                    <Link key={l.href} href={l.href}>
                        <div className="flex flex-col justify-start items-center hover:bg-blue-500 p-4 rounded-full">
                            <div className="">{l.content}</div>
                            {/* <h2>{l.name}</h2> */}
                        </div>
                    </Link>
                ))}
            </nav>
            <Router>
                <Route path="/:username">
                    {(params) => <Profile username={params.username} />}
                </Route>
                <Route path="/">
                    <div
                        className="md:col-span-6 gap-2 p-4"
                        aria-label="Content"
                    >
                        <div className="md:row-span-3 flex flex-col justify-start items-start py-2 mb-4 border-b-2 border-gray-600">
                            <h2 className="font-bold text-xl">Home</h2>
                        </div>
                        <div aria-label="Feed">
                            {currentPosts.map((post) => (
                                <div
                                    key={`${post.username}_${post.content}`}
                                    className="flex mb-4"
                                >
                                    <a
                                        href={`/${post.username}`}
                                        className="mr-4"
                                    >
                                        <div className="w-12">
                                            <img
                                                className="rounded-full"
                                                src={
                                                    blinq(users)
                                                        .where(
                                                            (u) =>
                                                                u.username ===
                                                                post.username
                                                        )
                                                        .first()?.avatar
                                                }
                                                alt={post.username}
                                            />
                                        </div>
                                    </a>
                                    <div className="flex flex-col justify-start items-start">
                                        <h3>
                                            <a href={`/${post.username}`}>
                                                {post.username}
                                            </a>
                                        </h3>
                                        <p>{post.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Route>
            </Router>
        </div>
    );
};
