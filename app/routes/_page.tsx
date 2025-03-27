import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import Footer from "~/components/elements/footer";
import Navbar from "~/components/elements/navbar";
import { getTokenFromRequest } from "~/lib/cookie";

const restrictedRoutes = ['/'];

export async function loader(args: LoaderFunctionArgs) {
    const token = await getTokenFromRequest(args.request);
    
    return {
        token
    };
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