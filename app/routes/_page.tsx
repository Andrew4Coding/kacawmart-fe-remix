import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
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

    return session.data?.user ?? null;
}

export default function PageLayout() {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}