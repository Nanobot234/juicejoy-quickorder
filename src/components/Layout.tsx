
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu as MenuIcon, X, LogIn, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state } = useCart();
  const { currentUser, isAuthenticated, isBusinessOwner, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/menu", label: "Juice Menu" },
    { path: "/contact", label: "Contact" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <span className="text-juicy-green font-bold text-2xl md:text-3xl">JuiceJoy</span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-base font-medium transition duration-200 hover:text-juicy-green ${
                    isActive ? "text-juicy-green" : "text-gray-600"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            {/* Authentication Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="mr-2">
                    <User className="h-5 w-5 mr-1" />
                    <span className="hidden sm:inline">
                      {currentUser?.name || "Account"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isBusinessOwner ? (
                    <DropdownMenuItem onClick={() => navigate("/business-dashboard")}>
                      Dashboard
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => navigate("/my-orders")}>
                      My Orders
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2"
                onClick={() => navigate("/login")}
              >
                <LogIn className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            )}
            
            <NavLink to="/cart" className="relative mr-2">
              <Button variant="ghost" className="rounded-full p-2">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-juicy-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </NavLink>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleMenu}>
                    <MenuIcon className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                  <div className="flex flex-col h-full py-6">
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-juicy-green font-bold text-xl">JuiceJoy</span>
                      <Button variant="ghost" size="icon" onClick={toggleMenu}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    <nav className="flex flex-col space-y-4">
                      {navItems.map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={({ isActive }) =>
                            `px-2 py-2 rounded-md ${
                              isActive
                                ? "bg-juicy-green/10 text-juicy-green font-medium"
                                : "text-gray-600 hover:bg-juicy-green/5 hover:text-juicy-green"
                            }`
                          }
                        >
                          {item.label}
                        </NavLink>
                      ))}
                      
                      {isAuthenticated ? (
                        <>
                          {isBusinessOwner ? (
                            <NavLink
                              to="/business-dashboard"
                              onClick={() => setIsMenuOpen(false)}
                              className={({ isActive }) =>
                                `px-2 py-2 rounded-md ${
                                  isActive
                                    ? "bg-juicy-green/10 text-juicy-green font-medium"
                                    : "text-gray-600 hover:bg-juicy-green/5 hover:text-juicy-green"
                                }`
                              }
                            >
                              Dashboard
                            </NavLink>
                          ) : (
                            <NavLink
                              to="/my-orders"
                              onClick={() => setIsMenuOpen(false)}
                              className={({ isActive }) =>
                                `px-2 py-2 rounded-md ${
                                  isActive
                                    ? "bg-juicy-green/10 text-juicy-green font-medium"
                                    : "text-gray-600 hover:bg-juicy-green/5 hover:text-juicy-green"
                                }`
                              }
                            >
                              My Orders
                            </NavLink>
                          )}
                          <Button
                            variant="ghost"
                            className="justify-start px-2 py-6 h-auto font-normal"
                            onClick={() => {
                              handleLogout();
                              setIsMenuOpen(false);
                            }}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                          </Button>
                        </>
                      ) : (
                        <NavLink
                          to="/login"
                          onClick={() => setIsMenuOpen(false)}
                          className={({ isActive }) =>
                            `px-2 py-2 rounded-md ${
                              isActive
                                ? "bg-juicy-green/10 text-juicy-green font-medium"
                                : "text-gray-600 hover:bg-juicy-green/5 hover:text-juicy-green"
                            }`
                          }
                        >
                          Login
                        </NavLink>
                      )}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">JuiceJoy</h3>
              <p className="text-gray-600 mb-4">
                Bringing fresh, nutritious juices to you daily. Made from locally sourced fruits and vegetables.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <NavLink 
                      to={item.path} 
                      className="text-gray-600 hover:text-juicy-green transition-colors"
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
                <li>
                  <NavLink 
                    to="/cart" 
                    className="text-gray-600 hover:text-juicy-green transition-colors"
                  >
                    Cart
                  </NavLink>
                </li>
                {isAuthenticated && !isBusinessOwner && (
                  <li>
                    <NavLink 
                      to="/my-orders" 
                      className="text-gray-600 hover:text-juicy-green transition-colors"
                    >
                      My Orders
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p className="text-gray-600 mb-2">123 Juice Street</p>
              <p className="text-gray-600 mb-2">Freshville, CA 90210</p>
              <p className="text-gray-600 mb-2">Phone: (555) 123-4567</p>
              <p className="text-gray-600">Email: hello@juicejoy.com</p>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} JuiceJoy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
