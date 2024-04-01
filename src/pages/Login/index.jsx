import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // for programmatically navigating
import { AuthContext } from "../../components/auth/AuthContext.jsx";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // useNavigate hook for navigation
  const { setCurrentUser } = useContext(AuthContext); // Use AuthContext to access the setCurrentUser function

  const obtainAccessToken = async (username, password) => {
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("username", username);
    params.append("password", password);

    try {
      const response = await fetch("http://127.0.0.1:8000/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.access_token); // Store the token
        setCurrentUser({ isLoggedIn: true }); // Update the authentication context
        navigate("/dashboard"); // Redirect to a protected route
      } else {
        throw new Error(
          data.error_description || "Failed to obtain access token"
        );
      }
    } catch (error) {
      setError("Login failed: " + error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    setError(""); // Clear any existing error messages
    await obtainAccessToken(username, password);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your username and password to log in.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="user1"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="off"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </CardFooter>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>
      </Card>
    </div>
  );
}
