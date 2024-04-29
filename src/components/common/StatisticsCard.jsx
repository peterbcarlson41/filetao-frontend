import React from "react";
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

export default function Statistics({ numberOfFiles, storageUsed, userCap }) {
  // Constants for total storage and formatting
  const storageTotal = userCap;
  const storageTotalFormatted = formatBytes(storageTotal).string;
  const storagePercentage = (storageUsed / storageTotal) * 100;
  const storageUsedFormatted = formatBytes(storageUsed).string;

  // Define your Tailwind colors
  const primaryColor = "#2462ea";
  const primaryTextColor = "#000000";
  const trailColor = "#e5e7eb";

  return (
    <>
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
          <div className="text-lg font-medium">{`${storageUsedFormatted} of ${storageTotalFormatted} used`}</div>
        </div>
      </CardContent>
      {/* <div className="p-5 border-t">
        <Button
          size="sm"
          className="w-full"
          onClick={() => navigate("/dashboard")}
        >
          Upgrade Storage
        </Button>
      </div> */}
    </>
  );
}
