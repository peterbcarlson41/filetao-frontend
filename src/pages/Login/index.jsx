import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/common/Navbar";
import { ResetPassword } from "@/components/common/ResetPassword";
import { useAuth } from "@/context/AuthContext"; // Adjust path as needed

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginWithGoogle } = useAuth(); // Get login methods from context
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateEmail(email)) {
      navigate("/update-info");
      return;
    }
    try {
      await login(email, password);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "Failed to log in. Check your email and password.",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Google Login Error",
        description: "Failed to login with Google.",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center h-screen px-5">
        <Card className="mx-auto max-w-sm text-left">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="username"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <ResetPassword />
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={handleGoogleLogin}
            >
              Login with Google
              <FaGoogle className="ml-4" />
            </Button>
            <div className="mt-4 text-center text-sm">
              {"Don’t have an account?"}
              <a
                href="#"
                className="underline pl-2"
                onClick={() => navigate("/register")}
              >
                Sign up
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
