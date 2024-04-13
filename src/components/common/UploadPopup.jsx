import React, { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/Spinner";

function UploadPopup({ files, result, onClose }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed right-5 bottom-0 flex justify-center items-end z-50 max-w-md">
      <Card className="m-4 w-full relative bg-white rounded-b-none">
        <CardHeader className="flex flex-row justify-between gap-10 items-center border-b h-16 px-2 bg-muted/40">
          <div className="flex items-center">
            <CardTitle className="text-lg pl-4">Upload Details</CardTitle>
          </div>
          <div className="flex gap-1 pb-1.5">
            <Button
              className="rounded-full"
              size="icon"
              variant="ghost"
              onClick={toggleExpand}
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 cursor-pointer" />
              ) : (
                <ChevronUp className="w-5 h-5 cursor-pointer" />
              )}
            </Button>
            <Button
              className="rounded-full"
              size="icon"
              variant="ghost"
              onClick={onClose}
            >
              <X className="w-5 h-5 cursor-pointer" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-0">
          {isExpanded && (
            <div className="flex flex-col justify-between pl-4 pr-2 py-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2"
                >
                  <p className="text-md text-start">{`${file.filename}.${file.extension}`}</p>
                  <LoadingSpinner className="text-blue-700" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="pl-4 pr-2 pb-0">{result}</CardFooter>
      </Card>
    </div>
  );
}

export default UploadPopup;
