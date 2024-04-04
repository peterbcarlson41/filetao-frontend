import React from "react";
import { useAuth } from "@/components/auth/AuthContext"; // Update this path to where your AuthContext is defined
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
          <MountainIcon className="h-6 w-6" />
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
            </Button> // Display Log Out button if authenticated
          )}
        </div>
      </div>
    </header>
  );
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
