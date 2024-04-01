import React from "react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
      <div className="grid items-center justify-center gap-6 px-4 text-center">
        <div className="space-y-2">
          <SearchIcon className="inline-block h-10 w-10 mx-auto" />
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Page not found
          </h1>
          <p className="max-w-md mx-auto text-gray-500 md:text-xl">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        <a
          className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-8 py-2 text-sm font-medium text-gray-700 shadow-sm gap-2 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          href="/"
        >
          Go to the home page
          <ChevronRightIcon className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

function ChevronRightIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
