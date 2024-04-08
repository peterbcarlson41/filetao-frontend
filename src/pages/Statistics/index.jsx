import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { formatBytes } from "@/utils/formatBytes";

export default function Statistics() {
  const [numberOfFiles, setNumberOfFiles] = useState(0);
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageWithUnits, setStorageWithUnits] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Retrieve the token from localStorage
        const authToken = localStorage.getItem("token");

        // Make sure we have the token before making the call
        if (!authToken) {
          console.error("No auth token found");
          return;
        }

        // Call the user_data endpoint
        const response = await fetch("http://127.0.0.1:8000/user_data", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        // Extract filecount and storage from stats
        setNumberOfFiles(data.stats.filecount);
        // Convert storage to GB assuming the value is in bytes
        setStorageUsed(formatBytes(data.stats.storage).value);
        setStorageWithUnits(formatBytes(data.stats.storage).string);
      } catch (error) {
        console.error("An error occurred while fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const storageTotal = 50;
  const storagePercentage = (storageUsed / storageTotal) * 100;

  // Define your Tailwind colors
  const primaryColor = "#2462ea";
  const primaryTextColor = "#000000";
  const trailColor = "#e5e7eb";

  return (
    <div className="h-screen pt-20 p-10">
      <Card className="w-full max-w-xs mx-auto bg-white shadow-md overflow-hidden">
        <CardHeader className="flex justify-between items-center p-5 border-b">
          <CardTitle>File Storage</CardTitle>
          <CardDescription>{numberOfFiles} files stored</CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <div className="w-40 h-40 mx-auto">
            <CircularProgressbar
              value={storagePercentage}
              text={`${storagePercentage.toFixed(1)}%`}
              styles={buildStyles({
                pathColor: primaryColor,
                textColor: primaryTextColor,
                trailColor: trailColor,
                textSize: "16px",
                pathTransitionDuration: 0.5,
                strokeLinecap: "round",
              })}
            />
          </div>
          <div className="text-center mt-4">
            <div className="text-lg font-medium">{`${storageWithUnits} of ${storageTotal} GB used`}</div>
          </div>
        </CardContent>
        <div className="p-5 border-t">
          <Button
            size="sm"
            className="w-full"
            onClick={() => navigate("/dashboard")}
          >
            View Files
          </Button>
        </div>
      </Card>
    </div>
  );
}
