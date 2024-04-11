import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import { Home, LineChart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerticalNavbar({ isMenuOpen }) {
  const { currentUser, logout } = useAuth();
  const handleLogout = () => {
    logout();
    // Assume you have `navigate` from `useHistory` or similar
    navigate("/");
  };

  // Set top offset based on the height of the FileDashboardNav
  const topOffset = "64px"; // This should be the height of the FileDashboardNav
  const sidebarHeight = `calc(100vh - ${topOffset})`;

  return (
    <aside
      className={`${
        isMenuOpen ? "fixed" : "hidden md:block"
      } md:relative z-20 transition-transform transform md:translate-x-0 w-64 max-w-full h-screen md:h-auto border-r bg-gray-50 overflow-y-auto`}
      style={{ top: topOffset, height: sidebarHeight }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 border-b px-6">
          <NavLink
            to="/"
            className="flex items-center gap-3 text-xl font-semibold text-gray-900"
          >
            <img src="/Subnet21.png" alt="Subnet 21 Logo" className="h-6 w-6" />
            FileTao
          </NavLink>
        </div>
        <nav className="flex-1 p-4">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </NavLink>
          <NavLink
            to="/statistics"
            className="flex items-center gap-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            <LineChart className="h-5 w-5" />
            Statistics
          </NavLink>
        </nav>
        {/* Additional links and buttons */}
        <div className="mt-auto p-5">
          {!currentUser ? (
            <>
              <a href="/login" className="inline-block">
                <Button size="sm" variant="secondary">
                  Login
                </Button>
              </a>
              <a href="/register" className="inline-block">
                <Button size="sm">Register</Button>
              </a>
            </>
          ) : (
            <Button onClick={handleLogout} size="sm">
              Log Out
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
