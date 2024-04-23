import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/auth/AuthContext";

// Mock local storage
const localStorageMock = (function () {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Helper component to access context
function ConsumerComponent() {
  const auth = useAuth();
  return <div>{auth.currentUser ? "Logged In" : "Logged Out"}</div>;
}

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("initializes with no user if no token is set", () => {
    const { queryByText } = render(
      <MemoryRouter>
        <AuthProvider>
          <ConsumerComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(queryByText("Logged Out")).toBeInTheDocument();
  });

  it("sets the user if a valid token is present", () => {
    localStorage.setItem("token", "valid-token");
    localStorage.setItem("token_expiry", (Date.now() + 10000).toString());

    const { queryByText } = render(
      <MemoryRouter>
        <AuthProvider>
          <ConsumerComponent />
        </AuthProvider>
      </MemoryRouter>
    );
  });

  it("logs out the user when the token expires", async () => {
    localStorage.setItem("token", "valid-token");
    localStorage.setItem("token_expiry", (Date.now() + 5000).toString());

    const { queryByText } = render(
      <MemoryRouter>
        <AuthProvider>
          <ConsumerComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    act(() => {
      vi.advanceTimersByTime(6000);
    });
  });
});
