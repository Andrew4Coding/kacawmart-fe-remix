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


export const getUserFromRequest = async (request: Request) => {
    const authClient = getServerAuthClient();

    const session = await authClient.getSession({
        fetchOptions: {
            headers: {
                Cookie: request.headers.get('Cookie') || '',
            }
        }
    });

    return session?.data?.user;
}