import React from "react";
import { LoadingSpinner } from "./Spinner";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

function LoadingPopup({ message }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm flex justify-center items-center z-50">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-row justify-between">
          <CardTitle className="text-2xl">{message}</CardTitle>
          <LoadingSpinner />
        </CardHeader>
      </Card>
    </div>
  );
}

export default LoadingPopup;
