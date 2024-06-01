import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/common/Navbar";
import { useAuth } from "@/context/AuthContext"; // Adjust path as needed
import { useToast } from "@/components/ui/use-toast";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register, registerWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(email, password); // Use register method from AuthContext
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Failed to register. Check your email and password.");
      toast({
        description: "Failed to register. Check your email and password.",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await registerWithGoogle(); // Use registerWithGoogle method from AuthContext
    } catch (error) {
      setError("Google sign-up failed. " + error.message);
      toast({
        description: "Google sign-up failed. " + error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen px-5">
        <Card className="mx-auto max-w-sm text-left">
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your email and password to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={handleGoogleSignUp}
            >
              Sign up with Google
              <FaGoogle className="ml-4" />
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?
              <a
                href="#"
                className="underline pl-2"
                onClick={() => navigate("/login")}
              >
                Log in
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
