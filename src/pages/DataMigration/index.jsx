import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function UpdateInfoForm() {
  const [username, setUsername] = useState("");
  const [originalPassword, setOriginalPassword] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const { updateUserInfo } = useAuth(); // Assuming you have an updateUserInfo method in your context
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const migrationInfo = {
      old_username: username,
      old_password: originalPassword,
      email: email,
      new_password: newPassword,
    };
    try {
      await migrateUser(migrationInfo);
      navigate("/dashboard"); // Redirect to home or login after successful update
    } catch (error) {
      console.error(error);
      setError("Failed to update information. Please check your details.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen px-5">
        <Card className="mx-auto max-w-sm text-left">
          <CardHeader>
            <CardTitle className="text-2xl">Update Your Information</CardTitle>
            <CardDescription>
              Enter your original username and password, along with your new
              email. Optionally, you can set a new password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Your original username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="original-password">Original Password</Label>
                <Input
                  id="original-password"
                  type="password"
                  required
                  value={originalPassword}
                  onChange={(e) => setOriginalPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your new email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password (optional)</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <Button type="submit" className="w-full">
                Update Information
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
