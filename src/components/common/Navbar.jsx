import React from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  let navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full px-4 h-14 border-b bg-gray-100 dark:bg-gray-950 border-gray-200/40 dark:border-gray-800/40 z-50">
      <div className="flex items-center justify-start h-full">
        <a className="flex items-center space-x-2" href="/">
          <img src="/Subnet21.png" alt="Subnet 21 Logo" className="h-6 w-6" />
        </a>
        <nav className="hidden md:flex pl-10 items-center gap-10 text-sm font-medium">
          {currentUser && (
            <>
              <a
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/upload"
              >
                Upload
              </a>
              <a
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/retrieve"
              >
                Retrieve
              </a>
              <a
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/myfiles"
              >
                My Files
              </a>
            </>
          )}
          <a
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="#"
          >
            About
          </a>
        </nav>
        <div className="ml-auto flex flex-row space-x-2">
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
            <Button onClick={handleLogout} size="sm" variant="secondary">
              Log Out
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
