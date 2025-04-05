import { createAuthClient } from "better-auth/client";
import { emailOTPClient } from "better-auth/client/plugins"

export const getServerAuthClient = () => {
    let auth_url = 'http://localhost:4000';

    return createAuthClient({
        baseURL: auth_url,
        plugins: [
            emailOTPClient()
        ]
    });
};
