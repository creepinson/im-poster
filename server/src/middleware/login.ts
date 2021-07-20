import type { FastifyRequest, FastifyReply } from "fastify";

export const isLoggedIn = async (
    request: FastifyRequest,
    res: FastifyReply,
    next: () => void
) => {
    const userId: string | undefined = request.session.get("userId");
    if (!userId)
        return res.status(401).send({
            error: "You must be logged in to access this resource"
        });
    next();
};
