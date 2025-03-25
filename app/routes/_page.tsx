import { Outlet } from "@remix-run/react";
import Footer from "~/components/elements/footer";
import Navbar from "~/components/elements/navbar";

export default function PageLayout() {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}