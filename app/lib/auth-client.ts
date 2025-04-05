import { createAuthClient } from "better-auth/client";

export const getServerAuthClient = () => {
    let auth_url = 'http://localhost:4000';

    return createAuthClient({
        baseURL: auth_url,
    });
};
