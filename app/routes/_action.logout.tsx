import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getServerAuthClient } from "~/lib/auth-client";

export async function loader(args: LoaderFunctionArgs) {
    const authClient = getServerAuthClient();


    const session = await authClient.getSession({
        fetchOptions: {
            headers: {
                Cookie: args.request.headers.get('Cookie') || '',
            }
        }
    });

    authClient.signOut({
        fetchOptions: {
            headers: {
                Cookie: args.request.headers.get('Cookie') || '',
            }
        },
    });


    const response = await fetch(`${process.env.AUTH_URL}/user/reset/email/verified`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Cookie: args.request.headers.get('Cookie') || '',
        },
        credentials: 'include',
    })

    try {
        const data = await response.json();
        console.log("Profile data:", data);
    }

    catch (error) {
        console.error("Error fetching profile data:", error);
    }

    return redirect('/login');
}