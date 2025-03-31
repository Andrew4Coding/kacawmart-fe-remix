import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Menu } from "lucide-react";

export default function Navbar() {
  const data: { token: string | null } = useLoaderData();

  return (
    <nav className="w-full fixed top-0 z-10 font-open px-10 bg-[#F1FFFA]">
      <div className="container mx-auto flex justify-between items-center py-6">
        <Link to="/" className="text-xl font-bold font-libre text-[#009579] lg:min-w-[300px]">
          KACAWMart
        </Link>
        <ul className="text-sm font-open-sans hidden md:flex w-full justify-center items-center">
          <li className="mx-2">
            <Link to="/">Home</Link>
          </li>
          <li className="mx-2">
            <Link to="/transaction">My Transaction</Link>
          </li>
        </ul>
        {
          data.token ?
            <Link to="/logout" className="hidden lg:flex lg:min-w-[300px] justify-end">
              <Button>
                Logout
              </Button>
            </Link>
            :
            <Link to="/login" className="hidden lg:flex lg:min-w-[300px] justify-end">
              <Button>
                Login
              </Button>
            </Link>
        }

        <Popover>
          <PopoverTrigger asChild>
            <Menu className="cursor-pointer md:hidden"/>
          </PopoverTrigger>
          <PopoverContent sideOffset={20} className="max-w-[200px]">
            <ul className="flex flex-col">
              <li className="my-2">
                <Link to="/">Home</Link>
              </li>
              <li className="my-2">
                <Link to="/transaction">My Transaction</Link>
              </li>
              {
                data.token ?
                  <Link to="/logout" className="my-2 w-full">
                    <Button className="w-full">
                      Logout
                    </Button>
                  </Link>
                  :
                  <Link to="/login" className="my-2 w-full">
                    <Button className="w-full">
                      Login
                    </Button>
                  </Link>
              }
            </ul>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}
