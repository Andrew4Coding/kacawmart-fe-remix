import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Footer from "~/components/elements/footer";
import Navbar from "~/components/elements/navbar";
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
    const currentPath = new URL(args.request.url).pathname;

    if (!session.data && currentPath !== '/login') {
        return redirect('/login');
    }
    else if (session.data?.user && !session.data?.user.emailVerified && !currentPath.includes('/otp')) {
        return redirect('/otp');
    }

    return session.data?.user ?? null;
}

export default function PageLayout() {
    const data = useLoaderData();
    return (
        <>
            <Navbar />
            <Outlet context={data}/>
            <Footer />
        </>
    )
}