import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getServerAuthClient } from "~/lib/auth-client";

export async function loader(args: LoaderFunctionArgs) {
    const authClient = getServerAuthClient();

    authClient.signOut({
        fetchOptions: {
            headers: {
                Cookie: args.request.headers.get('Cookie') || '',
            }
        },
    });

    return redirect('/login');
}