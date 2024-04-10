import React from "react";
import { LoadingSpinner } from "./Spinner";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { X } from "lucide-react";

function LoadingPopup({ message, result, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm flex justify-center items-center z-50">
      <Card className="w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-0 right-0 m-4">
          <X className="w-6 h-6 text-default hover:text-gray-700 dark:text-gray-400 dark:hover:text-white cursor-pointer" />
        </button>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl">{message}</CardTitle>
          <LoadingSpinner />
        </CardHeader>
        <CardFooter>{result}</CardFooter>
      </Card>
    </div>
  );
}

export default LoadingPopup;
