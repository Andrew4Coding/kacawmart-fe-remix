import { Link } from "@remix-run/react";

export default function Footer() {
    return (
        <footer className="w-full bottom-0 bg-white shadow-md z-10 font-libre border-t-2">
            <div className="container mx-auto flex justify-between items-center py-4">
                <p className="text-sm font-open-sans">
                    © 2021 KACAWMart. All rights reserved.
                </p>
                <ul className="flex text-sm font-open-sans">
                    <li className="mx-2">
                        <Link to="/privacy">Privacy</Link>
                    </li>
                    <li className="mx-2">
                        <Link to="/terms">Terms</Link>
                    </li>
                </ul>
            </div>
        </footer>
    );
}
