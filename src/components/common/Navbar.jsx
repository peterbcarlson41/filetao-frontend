import React, { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Tao from "@/components/common/Tao";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  let navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full px-4 h-14 border-b bg-gray-100 dark:bg-gray-950 border-gray-200/40 dark:border-gray-800/40 z-50">
      <div className="flex items-center justify-start h-full">
        <div className="flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden mr-2"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <a className="sm:flex hidden items-center space-x-2" href="/">
            <Tao />
          </a>
        </div>

        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:hidden absolute top-full left-0 bg-white dark:bg-gray-800 w-full px-4 py-2 border-b flex-col items-start`}
        >
          <a className="flex items-center space-x-2" href="/">
            <Tao />
          </a>
          {currentUser && (
            <>
              <a href="/dashboard" className="py-2 text-left">
                Dashboard
              </a>
            </>
          )}
          <a href="#" className="py-2 text-left">
            About
          </a>
        </div>

        <nav className="pl-5 hidden md:flex items-center gap-5 text-sm font-medium">
          {currentUser && (
            <>
              <a
                href="/dashboard"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                Dashboard
              </a>
            </>
          )}
          <a
            href="https://github.com/ifrit98/storage-subnet/blob/main/README.md"
            target="_blank"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            About
          </a>
        </nav>

        <div className="flex flex-row space-x-2 ml-auto">
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
    </header>
  );
}
