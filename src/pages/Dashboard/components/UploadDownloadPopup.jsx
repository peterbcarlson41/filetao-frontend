import React, { useState } from "react";
import { ChevronDown, ChevronUp, X, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/Spinner";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

function UploadDownloadPopup({ files, onClose }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const anyFileLoading = files.some((file) => file.loading);
  const actionTitle = files.some((file) => file.action === "download")
    ? "Download Details"
    : "Upload Details";

  return (
    <div className="fixed right-0 bottom-0 flex justify-end items-end z-50 max-w-md">
      <Card className="m-4 w-full relative bg-white">
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
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </Button>
            <Button
              className="rounded-full"
              size="icon"
              variant="ghost"
              onClick={onClose}
              disabled={anyFileLoading}
            >
              <X className="w-5 h-5" />
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
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <p
                        className="text-md text-start truncate"
                        style={{ maxWidth: "70%" }}
                      >
                        {`${file.filename}.${file.extension}`}
                      </p>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-fit bg-white p-2 shadow-lg rounded-md">
                      {`${file.filename}.${file.extension}`}
                    </HoverCardContent>
                  </HoverCard>
                  {file.loading ? (
                    <LoadingSpinner className="text-blue-700" />
                  ) : (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <span>
                          {file.status === "success" ? (
                            <Check className="text-green-500" />
                          ) : (
                            <X className="text-red-500" />
                          )}
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-40 bg-white p-2 shadow-lg rounded-md">
                        {file.status === "success"
                          ? "Upload successful"
                          : "Upload failed"}
                      </HoverCardContent>
                    </HoverCard>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default UploadDownloadPopup;
