import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";
import { Terminal, User, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const Header = () => {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2 text-indigo-500 hover:text-indigo-400 transition-colors">
          <Terminal className="h-6 w-6" />
          <span className="text-xl font-bold tracking-tight text-slate-100">Prompt-Base</span>
        </Link>
        
        {!isAuthPage && (
          <nav className="flex items-center space-x-4">
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
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                    <Terminal className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                    <User className="w-4 h-4 mr-2" />
                    {user?.name || 'Profile'}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout} className="text-slate-300 hover:text-white">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};
