import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getServerAuthClient } from "~/lib/auth-client";
import OtpModule from "~/modules/OtpModule";

export async function loader(args: LoaderFunctionArgs) { 
    const authClient = getServerAuthClient();
    const session = await authClient.getSession({
        fetchOptions: {
            headers: {
                Cookie: args.request.headers.get('Cookie') || '',
            }
        }
    });

    if (session.data?.user.emailVerified) {
        return redirect('/');
    }

    return null;
}

export default function Index() {
    return <OtpModule />
}