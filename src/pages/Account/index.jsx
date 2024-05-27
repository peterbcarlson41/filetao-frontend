import React, { useEffect, useState } from "react";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Navbar from "@/components/common/Navbar";
import { useAuth } from "@/context/AuthContext"; // Adjust the path as needed

export default function MyAccount() {
  const { currentUser, resetPassword, deleteUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setUserData(currentUser);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleResetPassword = async () => {
    if (!userData || !userData.email) return;
    try {
      await resetPassword(userData.email);
      alert("Password reset email sent successfully.");
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser();
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data found</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <div className="w-full max-w-3xl mx-auto px-4 py-8 md:px-6 md:py-12">
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <Separator />
              <CardHeader className="grid gap-4 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-medium text-base">
                      Delete Account
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                      Permanently delete your account and all your data.
                    </CardDescription>
                  </div>
                  <div className="min-w-[120px]">
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleDeleteAccount}
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-medium text-base">
                      Reset Password
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                      Change your account password.
                    </CardDescription>
                  </div>
                  <div className="min-w-[120px]">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleResetPassword}
                    >
                      Reset Password
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
