import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/common/Navbar";
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

// Define the schema using Zod for form validation
const registrationSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export default function RegisterForm() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const BASE_URL = import.meta.env.VITE_APP_API_URL;

  const form = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const url = `${BASE_URL}/register/`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        form.setError("username", {
          type: "manual",
          message:
            responseData.detail || "Registration failed, please try again.",
        });
      }
    } catch (error) {
      form.setError("username", {
        type: "manual",
        message: "Network error, please try again later.",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen px-5">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Register</CardTitle>
            <CardDescription>
              Enter a username and password to register.
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
                <Button type="submit">Register</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
