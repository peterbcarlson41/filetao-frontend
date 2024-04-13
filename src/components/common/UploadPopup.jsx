import React, { useState } from "react";
import { LoadingSpinner } from "./Spinner";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function UploadPopup({ filename, extension, result, size, onClose }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed right-5 bottom-0 flex justify-center items-end z-50 max-w-md">
      <Card className="m-4 w-full relative bg-white rounded-b-none">
        <CardHeader className="flex flex-row justify-between items-center border-b h-16 px-2 bg-muted/40">
          <div className="flex items-center">
            <CardTitle className="text-lg pl-4">Upload Details</CardTitle>
          </div>
          <div className="flex gap-1 pb-1.5">
            <Button className="rounded-full" size="icon" variant="ghost">
              <ChevronDown className="w-5 h-5 cursor-pointer" />
            </Button>
            <Button className="rounded-full" size="icon" variant="ghost">
              <X className="w-5 h-5 cursor-pointer" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col justify-between pl-4 pr-2 py-2">
            <p className="text-sm">{`${filename}.${extension}`}</p>
            <p className="text-sm">{size}</p>
          </div>
        </CardContent>
        <CardFooter className="pl-4 pr-2 pb-2">{result}</CardFooter>
      </Card>
    </div>
  );
}

export default UploadPopup;
