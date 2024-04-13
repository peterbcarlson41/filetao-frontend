import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/common/navbar";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define the validation schema using Zod
const loginSchema = z.object({
  username: z.string().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const BASE_URL = import.meta.env.VITE_APP_API_URL;

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const params = new URLSearchParams();
      params.append("grant_type", "password");
      params.append("username", data.username);
      params.append("password", data.password);

      const response = await fetch(`${BASE_URL}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const responseData = await response.json();

      if (response.ok) {
        localStorage.setItem("token", responseData.access_token);
        setCurrentUser({ isLoggedIn: true });
        navigate("/dashboard");
      } else {
        form.setError("password", {
          type: "manual",
          message: responseData.detail || "Failed to obtain access token",
        });
      }
    } catch (error) {
      form.setError("password", {
        type: "manual",
        message: "Network error. Please try again later.",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen px-5">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your username and password to log in.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col space-y-2"
              >
                <FormItem>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <FormControl>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      {...form.register("username")}
                    />
                  </FormControl>
                  <div style={{ minHeight: "20px" }}>
                    <FormMessage>
                      {form.formState.errors.username?.message}
                    </FormMessage>
                  </div>
                </FormItem>
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      {...form.register("password")}
                    />
                  </FormControl>
                  <div style={{ minHeight: "20px" }}>
                    <FormMessage>
                      {form.formState.errors.password?.message}
                    </FormMessage>
                  </div>
                </FormItem>
                <Button type="submit">Sign In</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
