import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";
import { Terminal, User, LogOut, ShieldCheck, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-500 bg-slate-50/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2 text-slate-900 hover:text-slate-700 transition-colors">
          <Terminal className="h-6 w-6" />
          <span className="text-xl font-bold tracking-tight text-slate-900">Prompt-Base</span>
        </Link>
        
        {!isAuthPage && (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link to="/admin">
                      <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                      <Terminal className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                      <User className="w-4 h-4 mr-2" />
                      {user?.name || 'Profile'}
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout} className="text-slate-600 hover:text-slate-900">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-slate-600 hover:text-slate-900 font-medium text-base px-4">Log In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-slate-900 text-white hover:bg-slate-800 font-medium text-base px-4">Sign Up</Button>
                  </Link>
                </>
              )}
              
              <div className="ml-2">
                <ThemeToggle />
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-600 hover:text-slate-900"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && !isAuthPage && (
        <div className="md:hidden border-t border-slate-500 bg-slate-50/95 backdrop-blur-xl absolute left-0 right-0 top-16 min-h-[calc(100vh-4rem)] p-4 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-4">
             {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="p-2">
                       <Button variant="ghost" className="w-full justify-start text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 h-10">
                        <ShieldCheck className="w-5 h-5 mr-3" />
                         Admin Dashboard
                      </Button>
                    </Link>
                  )}
                  <Link to="/dashboard" className="p-2">
                     <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-900 h-10">
                      <Terminal className="w-5 h-5 mr-3" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/profile" className="p-2">
                     <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-900 h-10">
                      <User className="w-5 h-5 mr-3" />
                      My Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" onClick={logout} className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 h-10 p-2">
                    <LogOut className="w-5 h-5 mr-3" />
                    LogOut
                  </Button>
                  <div className="pt-4 border-t border-slate-500 flex justify-between items-center px-2">
                     <span className="text-slate-500">Theme</span>
                     <ThemeToggle />
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="p-2">
                    <Button variant="ghost" className="w-full h-12 text-lg text-slate-600 hover:text-slate-900">Log In</Button>
                  </Link>
                  <Link to="/signup" className="p-2">
                    <Button className="w-full h-12 text-lg bg-slate-900 text-white hover:bg-slate-800">Sign Up</Button>
                  </Link>
                </>
              )}
          </nav>
        </div>
      )}
    </header>
  );
};
