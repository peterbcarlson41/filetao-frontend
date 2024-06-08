import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { sendEmailVerification, deleteUser } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast"; // Import useToast and ToastAction

const VerifyEmailPage = () => {
  const { logout } = useAuth();
  const { currentUser, saveUserToBackend } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast(); // Destructure toast from useToast
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Initially disabled
  const [countdown, setCountdown] = useState(45); // Countdown timer

  useEffect(() => {
    const interval = setInterval(() => {
      currentUser.reload().then(async () => {
        if (currentUser.emailVerified) {
          clearInterval(interval);
          const backendSaveSuccess = await saveUserToBackend(currentUser);
          if (backendSaveSuccess) {
            navigate("/dashboard");
          }
        }
      });
    }, 3000); // Check every 3 seconds

    // Enable the resend email button after 30 seconds
    const buttonTimeout = setTimeout(() => {
      setIsButtonDisabled(false);
      setCountdown(45);
    }, 30000); // 30 seconds

    return () => {
      clearInterval(interval);
      clearTimeout(buttonTimeout);
    };
  }, [currentUser, navigate, saveUserToBackend]);

  useEffect(() => {
    if (isButtonDisabled) {
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      if (countdown === 0) {
        setIsButtonDisabled(false);
        clearInterval(countdownInterval);
      }

      return () => clearInterval(countdownInterval);
    }
  }, [isButtonDisabled, countdown]);

  const handleReturnToLogin = async () => {
    try {
      await deleteUser(currentUser);
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete user.",
        description: "Please try again.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  const handleSendVerificationEmail = async () => {
    setIsSendingEmail(true);
    try {
      await sendEmailVerification(currentUser);
      toast({
        variant: "default",
        title: "Verification email sent!",
        description: "Please check your inbox.",
      });

      // Disable the button for 45 seconds
      setIsButtonDisabled(true);
      setCountdown(45);
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast({
        variant: "destructive",
        title: "Failed to send verification email.",
        description: "Please try again.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
    setIsSendingEmail(false);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            We've sent a verification email to your email address. Please check
            your inbox and click the link to verify your email and complete your
            account setup.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Button variant="outline" onClick={handleReturnToLogin}>
              Return to Login
            </Button>
            <Button
              onClick={handleSendVerificationEmail}
              disabled={isSendingEmail || isButtonDisabled}
            >
              {isSendingEmail
                ? "Sending..."
                : isButtonDisabled
                ? `Wait ${countdown}s`
                : "Resend Verification Email"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
