import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "../ui/button";

export default function Navbar() {
  const data: { token: string | null } = useLoaderData();

  return (
    <nav className="w-full fixed top-0 bg-white z-10 font-libre border-b-2 px-10  ">
      <div className="container mx-auto flex justify-between items-center py-4">
        <Link to="/" className="text-xl font-bold">
          Logo
        </Link>
        <ul className="text-sm font-open-sans hidden md:flex">
          <li className="mx-2">
            <Link to="/">Home</Link>
          </li>
          <li className="mx-2">
            <Link to="/about">About</Link>
          </li>
          <li className="mx-2">
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
        {
          data.token ?
            <Link to="/logout">
              <Button>
                Logout
              </Button>
            </Link>
            :
            <Link to="/login">
              <Button>
                Login
              </Button>
            </Link>
        }
      </div>
    </nav>
  );
}
