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

    if (currentPath == '') {
        return session.data?.user ?? null;
    }

    if (!session.data) {
        if (currentPath !== '/login' && !currentPath.startsWith('/register') && !currentPath.startsWith('/forgot-password') && !currentPath.startsWith('/reset-password')) {
            return redirect('/login');
        }
    } else if (!session.data.user?.emailVerified) {
        if (!currentPath.includes('/otp')) {
            return redirect('/otp');
        }
    } else {
        if (currentPath === '/login' || currentPath.startsWith('/register')) {
            return redirect('/');
        }
    }

    return {
        ...session.data?.user,
        authUrl: process.env.AUTH_URL,
    };
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