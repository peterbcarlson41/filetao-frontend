import React, { useState } from "react";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/common/Spinner";
export default function FileInput() {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // New loading state

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUploading(true);

    if (!selectedFiles) {
      alert("Please select files to upload.");
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }

    const accessToken = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/uploadfiles", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result);
      alert("Files uploaded successfully.");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="max-w-sm w-full">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <div>File Upload</div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="space-y-2 relative">
                <Label htmlFor="file">Choose Files</Label>
                <div className="flex items-center relative">
                  <Input
                    id="file"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="pl-3 pr-10 py-2 w-full text-gray-500" // Adjust padding and text styling as needed
                  />
                  {isUploading && (
                    <div className="absolute inset-y-0 right-0 flex items-center justify-center pr-3">
                      <LoadingSpinner className="h-5 w-5 text-blue-500" />
                    </div>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Upload Files
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
