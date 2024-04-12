import React from "react";
import { LoadingSpinner } from "./Spinner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

function UploadPopup({ filename, extension, result, size, onClose }) {
  return (
    <div className="fixed inset-0 flex justify-end items-end z-50">
      <Card className="m-4 max-w-sm relative bg-gray-200">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl pt-5">Upload Details</CardTitle>
          <button onClick={onClose} className="absolute top-0 right-0 pr-2">
            <ChevronDown className="w-6 h-6 text-default hover:text-gray-700 dark:text-gray-400 dark:hover:text-white cursor-pointer" />
          </button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row justify-between">
            <p className="text-lg">{`${filename}.${extension}`}</p>
            <p className="text-lg">{size}</p>
            <LoadingSpinner />
          </div>
        </CardContent>
        <CardFooter>{result}</CardFooter>
      </Card>
    </div>
  );
}

export default UploadPopup;
