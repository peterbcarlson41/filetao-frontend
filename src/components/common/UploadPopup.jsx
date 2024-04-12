import React from "react";
import { LoadingSpinner } from "./Spinner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { X } from "lucide-react";

function UploadPopup({ message, result, onClose }) {
  return (
    <div className="fixed inset-0 flex justify-end items-end z-50">
      <Card className="m-4 max-w-sm relative bg-gray-200">
        <CardHeader className="flex items-end">
          <button onClick={onClose} className="absolute top-0 right-0 m-4">
            <X className="w-6 h-6 text-default hover:text-gray-700 dark:text-gray-400 dark:hover:text-white cursor-pointer" />
          </button>
          <CardTitle className="text-2xl">{message}</CardTitle>
          <CardContent></CardContent>
        </CardHeader>
        <CardFooter>
          <LoadingSpinner />
          {result}
        </CardFooter>
      </Card>
    </div>
  );
}

export default UploadPopup;
