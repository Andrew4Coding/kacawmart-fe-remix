import { Link, useLoaderData, useLocation } from "@remix-run/react"
import { ChevronDown, Home, LogIn, LogOut, Menu, Package, Receipt, ShoppingBag, ShoppingCart, User, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { cn } from "~/lib/utils"

interface SessionData {
  email: string
  name: string
}

interface NavbarNavigationProps {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const navbarNavigationData: NavbarNavigationProps[] = [
  { name: "Home", path: "/", icon: <Home className="h-4 w-4" /> },
  { name: "Explore", path: "/explore", icon: <Package className="h-4 w-4" /> },
  { name: "My Transactions", path: "/transaction", icon: <Receipt className="h-4 w-4" /> },
  { name: "My Cart", path: "/cart", icon: <ShoppingCart className="h-4 w-4" /> },
]

const NavbarNavigation: React.FC<NavbarNavigationProps> = ({ name, path, icon }) => {
  const location = useLocation()
  const isActive = location.pathname === path

  return (
    <Link
      to={path}
      className={cn(
        "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1",
        isActive ? "text-emerald-700 bg-emerald-100" : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50",
      )}
    >
      {icon}
      <span>{name}</span>
    </Link>
  )
}

export default function Navbar() {
  const data: SessionData | undefined = useLoaderData()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav
      className={cn(
        "w-full fixed top-0 z-50 transition-all duration-300",
        scrolled ? "py-8 bg-white shadow-md" : "py-4 bg-gradient-to-r from-emerald-50 to-teal-50",
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <ShoppingBag className="h-6 w-6" />
          <span className="font-serif tracking-tight">KACAWMart</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navbarNavigationData.map((item) => (
            <NavbarNavigation key={item.path} {...item} />
          ))}
        </div>

        {/* User Account Section */}
        <div className="hidden md:flex items-center space-x-4">
          {data ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-2">
                  <Avatar className="h-8 w-8 border-2 border-emerald-100">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${data.name}`} alt={data.name} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                      {getInitials(data.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium text-gray-800">{data.name}</span>
                    <span className="text-xs text-gray-500">{data.email}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/transaction" className="cursor-pointer flex items-center">
                    <Receipt className="mr-2 h-4 w-4" />
                    <span>Transactions</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/logout" className="cursor-pointer text-red-500 flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center space-x-2">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-emerald-50 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-white z-40 pt-20 px-6 md:hidden transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col space-y-4">
          {data && (
            <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-lg mb-4">
              <Avatar className="h-12 w-12 border-2 border-emerald-100">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${data.name}`} alt={data.name} />
                <AvatarFallback className="bg-emerald-100 text-emerald-700">{getInitials(data.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-800">{data.name}</p>
                <p className="text-sm text-gray-500">{data.email}</p>
              </div>
            </div>
          )}

          <Link
            to="/"
            className={cn(
              "flex items-center space-x-3 p-4 rounded-md transition-colors",
              isActive("/") ? "bg-emerald-100 text-emerald-700" : "hover:bg-gray-100",
            )}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Home</span>
          </Link>

          <Link
            to="/transaction"
            className={cn(
              "flex items-center space-x-3 p-4 rounded-md transition-colors",
              isActive("/transaction") ? "bg-emerald-100 text-emerald-700" : "hover:bg-gray-100",
            )}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Receipt className="h-5 w-5" />
            <span className="font-medium">My Transactions</span>
          </Link>

          <div className="pt-4 mt-4 border-t border-gray-200">
            {data ? (
              <Link
                to="/logout"
                className="flex items-center space-x-3 p-4 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </Link>
            ) : (
              <Link to="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center space-x-2">
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

