import { SubmitHandler, useForm } from "react-hook-form";
import React from "react";
import * as api from "./api";
import { Link } from "wouter";
import { toast } from "react-toastify";
import { useLocation } from "wouter";

export const Login = (props: { isSignup?: boolean }) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<{ username: string; password: string }>();
    const [_location, setLocation] = useLocation();
    const onSubmit: SubmitHandler<{ username: string; password: string }> = (
        data
    ) => {
        if (props.isSignup) {
            api.signup(data)
                .then(() => setLocation("/login"))
                .catch((err) => {
                    if (api.isAxiosError<{ error: string }>(err))
                        toast.dark(err.response?.data.error);
                    else console.error(err);
                });
        }
        api.login(data)
            .then(() => {
                api.auth();

                api.getProfile()
                    .then((res) => {
                        api.authStore.update((s) => {
                            s.user = res;
                        });
                        console.log(res)
                        setLocation("/");
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                if (api.isAxiosError<{ error: string }>(err))
                    toast.dark(err.response?.data.error);
                else console.error(err);
            });
    };

    return (
        <form
            className="flex flex-col justify-start items-center"
            onSubmit={handleSubmit(onSubmit)}
        >
            {props.isSignup ? (
                <Link
                    href="/login"
                    className="rounded-lg bg-gray-900  p-2 justify-center flex min-w-full mb-4"
                >
                    Go to login
                </Link>
            ) : (
                <Link
                    href="/signup"
                    className="rounded-lg bg-gray-900 p-2 justify-center flex min-w-full mb-4"
                >
                    Go to signup
                </Link>
            )}

            <h2 className="text-xl mb-4 font-semibold">
                {props.isSignup ? "Sign up" : "Log in"}
            </h2>

            {/* register your input into the hook by invoking the "register" function */}
            <input
                className="mb-4 bg-gray-900 p-2 rounded-lg"
                defaultValue="theo"
                {...register("username", {
                    required: "A username is required"
                })}
            />
            {errors.username && (
                <span className="bg-gray-900 text-red-600 mb-2">
                    {errors.username.message}
                </span>
            )}

            <input
                type="password"
                className="mb-4 bg-gray-900 p-2 rounded-lg"
                defaultValue="1234"
                {...register("password", {
                    required: "A password is required"
                })}
            />
            {errors.password && (
                <span className="bg-gray-900 text-red-600 mb-2">
                    {errors.password.message}
                </span>
            )}

            <button
                type="submit"
                className="bg-gray-900 p-2 justify-center flex min-w-full rounded-lg"
            >
                Submit
            </button>
        </form>
    );
};
