import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { sendEmailVerification } from "firebase/auth";

const VerifyEmailPage = () => {
  const { logout } = useAuth();
  const { currentUser, saveUserToBackend } = useAuth();
  const navigate = useNavigate();
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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

    return () => clearInterval(interval);
  }, [currentUser, navigate, saveUserToBackend]);

  const handleReturnToLogin = () => {
    logout();
  };

  const handleSendVerificationEmail = async () => {
    setIsSendingEmail(true);
    try {
      await sendEmailVerification(currentUser);
      alert("Verification email sent!");

      // Disable the button for 30 seconds
      setIsButtonDisabled(true);
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 30000); // 30 seconds
    } catch (error) {
      console.error("Error sending verification email:", error);
      alert("Failed to send verification email. Please try again.");
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
                ? "Wait 30s"
                : "Send Verification Email"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
