import React, { useState, ReactNode, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Route, Router } from "wouter";
import { faHashtag, faHome, faUser } from "@fortawesome/free-solid-svg-icons";
import { authStore, getPosts, getProfiles, Post } from "./api";
import { Profile } from "./Profile";
import { Login } from "./login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const App = () => {
    const user = authStore.useState((s) => s.user);

    const [currentPosts, setCurrentPosts] = useState<
        (Post & { avatar?: string })[]
    >([]);

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
                href: `/${user?.username ? `u/${user.username}` : "login"}`,
                name: "Profile",
                content: (
                    <FontAwesomeIcon icon={faUser} className="" size="2x" />
                )
            }
        ]);
    }, [user]);

    const postsPerPage = 10;

    useEffect(() => {
        getPosts().then((posts) => {
            getProfiles().then((users) => {
                if (posts && users)
                    setCurrentPosts(
                        posts
                            .filter((_x, i) => i < postsPerPage)
                            .map((p) => ({
                                ...p,
                                // Find the corresponding avatar for each post
                                avatar: users.find((u) => u._id === p.user)
                                    ?.avatar,
                                username: users.find((u) => u._id === p.user)
                                    ?.username
                            }))
                    );
            });
        });
    }, []);

    return (
        <div className="bg-gray-800 text-white flex flex-col justify-start items-start min-h-screen">
            <nav
                className="flex items-center justify-start p-4 pl-6 mt-2 mb-6 border-b-2 gap-4 w-full border-gray-600"
                aria-label="Navigation"
            >
                <div className="rounded-full flex flex-col justify-center items-center mr-6">
                    <h1 className="font-extrabold text-3xl">ImPoster</h1>
                </div>
                {links.map((l) => (
                    <Link key={l.href} href={l.href}>
                        <div className="flex flex-col justify-center items-center rounded-full mr-2">
                            <div className="">{l.content}</div>
                            {/* <h2>{l.name}</h2> */}
                        </div>
                    </Link>
                ))}
            </nav>
            <ToastContainer />
            <Router>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/signup">
                    <Login isSignup />
                </Route>
                <Route path="/u/:username">
                    {(params) => <Profile username={params.username} />}
                </Route>
                <Route path="/">
                    <div
                        className="flex flex-col justify-center items-center flex-wrap gap-2 p-4"
                        aria-label="Content"
                    >
                        <div className="flex flex-col justify-start items-start py-2 mb-4 border-b-2 border-gray-600">
                            <h2 className="font-bold text-xl">Home</h2>
                        </div>
                        <div aria-label="Feed">
                            {currentPosts.map((post) => (
                                <div
                                    key={`${post.username}_${post.content}`}
                                    className="flex mb-4"
                                >
                                    <a
                                        href={`/u/${post.username}`}
                                        className="mr-4"
                                    >
                                        <div className="w-12">
                                            <img
                                                className="rounded-full"
                                                src={post.avatar}
                                                alt={post.username}
                                            />
                                        </div>
                                    </a>
                                    <div className="flex flex-col justify-start items-start">
                                        <h3>
                                            <a href={`/u/${post.username}`}>
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
