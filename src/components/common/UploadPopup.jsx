import React, { useState } from "react";
import { ChevronDown, ChevronUp, X, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/Spinner";

function UploadPopup({ files, onClose }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Check if any file is still loading
  const anyFileLoading = files.some((file) => file.loading);

  // Determine the action to display in the title
  const actionTitle = files.some((file) => file.action === "download")
    ? "Download Details"
    : "Upload Details";

  return (
    <div className="fixed right-5 bottom-0 flex justify-center items-end z-50 max-w-md">
      <Card className="m-4 w-full relative bg-white rounded-b-none">
        <CardHeader className="flex flex-row justify-between gap-10 items-center border-b h-16 px-2 bg-muted/40">
          <CardTitle className="text-lg pl-4">{actionTitle}</CardTitle>
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
              disabled={anyFileLoading}
            >
              <X className="w-5 h-5 cursor-pointer" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isExpanded && (
            <div className="flex flex-col justify-between p-6 gap-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2"
                >
                  <p className="text-md text-start">{`${file.filename}.${file.extension}`}</p>
                  {file.loading ? (
                    <LoadingSpinner className="text-blue-700" />
                  ) : file.status === "success" ? (
                    <Check className="text-green-500" />
                  ) : file.status === "failed" ? (
                    <X className="text-red-500" />
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default UploadPopup;
